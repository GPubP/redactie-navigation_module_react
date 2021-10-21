import { ContentSchema } from '@redactie/content-module';
import { omit } from 'ramda';

import { NAV_ITEM_STATUSES } from '../components';
import { CreateTreeItemPayload, TreeItem } from '../services/trees';

export const setTreeItemStatusByContent = (
	treeItem: TreeItem | CreateTreeItemPayload,
	contentItem: ContentSchema
): TreeItem | CreateTreeItemPayload => {
	const navItemIsPublished = treeItem.publishStatus === NAV_ITEM_STATUSES.PUBLISHED;
	const contentItemIsUnpublished = contentItem.meta.status === 'UNPUBLISHED';
	const navItemIsReady = treeItem.publishStatus === NAV_ITEM_STATUSES.READY;
	const contentItemIsPublished = contentItem.meta.status === 'PUBLISHED';
	const shouldDepublish = navItemIsPublished && contentItemIsUnpublished;
	const shouldPublish = navItemIsReady && contentItemIsPublished;

	return omit(['weight'], {
		...treeItem,
		slug: contentItem?.meta.slug.nl ?? '',
		publishStatus: shouldDepublish
			? NAV_ITEM_STATUSES.ARCHIVED
			: shouldPublish
			? NAV_ITEM_STATUSES.PUBLISHED
			: treeItem.publishStatus,
	});
};
