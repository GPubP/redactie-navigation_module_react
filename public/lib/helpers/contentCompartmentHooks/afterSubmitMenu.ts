import { ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';
import { omit } from 'ramda';
import { take } from 'rxjs/operators';

import { NAV_STATUSES } from '../../components';
import { ContentStatus } from '../../navigation.types';
import { menuItemsFacade } from '../../store/menuItems';
/**
 *
 * The afterSubmit hook
 * This function is called after submitting a content item.
 */
const afterSubmitMenu: ExternalCompartmentAfterSubmitFn = async (
	error,
	contentItem,
	contentType,
	prevContentItem,
	site
): Promise<void> => {
	const pendingMenuItems = await menuItemsFacade.pendingMenuItems$.pipe(take(1)).toPromise();

	const contentIsPublished =
		contentItem.meta.status === ContentStatus.PUBLISHED &&
		prevContentItem?.meta.status !== ContentStatus.PUBLISHED;

	const contentIsArchived =
		contentItem.meta.status === ContentStatus.UNPUBLISHED &&
		prevContentItem?.meta.status !== ContentStatus.UNPUBLISHED;

	const pendingUpsertWithContentLink = (pendingMenuItems?.upsertItems || [])?.map(pendingItem => {
		return {
			...omit(['weight'], pendingItem),
			slug: contentItem.meta.slug[contentItem.meta.lang],
			externalReference: contentItem.uuid,
			// TODO: fix types
			externalUrl: (site?.data.url as any)[contentItem.meta.lang],
			...(contentIsPublished &&
				pendingItem.publishStatus === NAV_STATUSES.READY && {
					publishStatus: NAV_STATUSES.PUBLISHED,
				}),
			...(contentIsArchived &&
				pendingItem.publishStatus !== NAV_STATUSES.ARCHIVED && {
					publishStatus: NAV_STATUSES.ARCHIVED,
				}),
		};
	});

	if (
		!site?.uuid ||
		(pendingMenuItems?.upsertItems.length === 0 && pendingMenuItems.deleteItems.length === 0)
	) {
		return Promise.resolve();
	}

	await menuItemsFacade
		.upsertContentMenuItems(site?.uuid || '', {
			upsertItems: pendingUpsertWithContentLink,
			deleteItems: pendingMenuItems?.deleteItems || [],
		})
		.then(() =>
			menuItemsFacade.getContentMenuItems(site?.uuid || '', contentItem?.uuid || '', {
				pagesize: -1,
			})
		);

	menuItemsFacade.setPendingMenuItems({
		upsertItems: [],
		deleteItems: [],
	});
};

export default afterSubmitMenu;
