import { ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';

import { NAV_ITEM_STATUSES } from '../../components/ContentDetailCompartment';
import { treesFacade } from '../../store/trees';

const afterSubmit: ExternalCompartmentAfterSubmitFn = (
	error,
	activeCompartmentName,
	moduleValue,
	contentItem
): Promise<any> => {
	// Only do something when the content item is successfully saved
	console.log(error, '//////////////:');
	// if (error) {
	// 	return Promise.resolve();
	// }
	const navModuleValue = contentItem.modulesData?.navigation;
	if (!navModuleValue) {
		return Promise.resolve();
	}

	const navItemExist =
		navModuleValue.id !== undefined && navModuleValue.id !== null && navModuleValue.id !== '';
	const navItemIsPublished = navModuleValue.status === NAV_ITEM_STATUSES.PUBLISHED;
	// TODO: import 'UNPUBLISHED' status from content module when available
	const contentItemIsUnpublished = contentItem.meta.status === 'UNPUBLISHED';
	const updateErrorMessage = `Archiveren van het navigatie item ${navModuleValue.label} mislukt.`;

	console.log(
		navItemExist,
		navItemIsPublished,
		contentItemIsUnpublished,
		navModuleValue,
		contentItem
	);

	if (!(navItemExist && navItemIsPublished && contentItemIsUnpublished)) {
		return Promise.resolve();
	}

	const body = {
		label: navModuleValue.label,
		slug: navModuleValue.slug,
		description: navModuleValue.description,
		parentId:
			navModuleValue.position.length > 0
				? navModuleValue.position[navModuleValue.position.length - 1]
				: undefined,
		publishStatus: NAV_ITEM_STATUSES.ARCHIVED,
	};

	return treesFacade
		.updateTreeItem(navModuleValue.navigationTree, navModuleValue.id, body)
		.then(response => {
			if (!response) {
				throw new Error(updateErrorMessage);
			}
			return treesFacade.getTree(navModuleValue.id);
		})
		.catch(() => {
			throw new Error(updateErrorMessage);
		});
};

export default afterSubmit;
