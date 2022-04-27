import { ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';
import { omit } from 'ramda';
import { take } from 'rxjs/operators';

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

	const pendingUpsertWithContentLink = (pendingMenuItems?.upsertItems || [])?.map(pendingItem => {
		return {
			...omit(['weight'], pendingItem),
			slug: contentItem.meta.slug[contentItem.meta.lang],
			externalReference: contentItem.uuid,
			// TODO: fix types
			externalUrl: (site?.data.url as any)[contentItem.meta.lang],
		};
	});

	if (!site?.uuid) {
		return;
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
		)
		.catch(() => {
			throw new Error();
		});

	menuItemsFacade.setPendingMenuItems({
		upsertItems: [],
		deleteItems: [],
	});
	return;
};

export default afterSubmitMenu;
