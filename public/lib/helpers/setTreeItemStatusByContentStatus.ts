import { ContentSchema } from '@redactie/content-module';
import { SiteDetailModel } from '@redactie/sites-module';
import { omit } from 'ramda';

import { NAV_ITEM_STATUSES } from '../components';
import { CreateTreeItemPayload, TreeItem } from '../services/trees';

import { generateExternalUrl } from './generateExternalUrl';

export const setTreeItemStatusByContent = (
	treeItem: TreeItem | CreateTreeItemPayload,
	contentItem: ContentSchema,
	site: SiteDetailModel | undefined
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
		externalUrl: generateExternalUrl(site, contentItem),
		publishStatus: shouldDepublish
			? NAV_ITEM_STATUSES.ARCHIVED
			: shouldPublish
			? NAV_ITEM_STATUSES.PUBLISHED
			: treeItem.publishStatus,
	});
};
