import { ContentSchema, ModuleValue } from '@redactie/content-module';

import { ContentDetailCompartmentFormState, NAV_ITEM_STATUSES } from '../../components';
import { CreateTreeItemPayload, UpdateTreeItemPayload } from '../../services/trees';
import { treesFacade } from '../../store/trees';

const getBody = (
	moduleValue: ContentDetailCompartmentFormState
): UpdateTreeItemPayload | CreateTreeItemPayload => {
	return {
		label: moduleValue.label,
		slug: moduleValue.slug,
		description: moduleValue.description,
		parentId:
			moduleValue.position.length > 0
				? moduleValue.position[moduleValue.position.length - 1]
				: undefined,
		publishStatus: moduleValue.status,
	};
};

const updateTreeItem = (
	navModuleValue: ContentDetailCompartmentFormState,
	body: UpdateTreeItemPayload
): Promise<ContentDetailCompartmentFormState> => {
	const updateErrorMessage = 'Wijzigen van het item in de navigatieboom is mislukt';
	return treesFacade
		.updateTreeItem(navModuleValue.navigationTree, navModuleValue.id || '', body)
		.then(response => {
			if (response) {
				return {
					...navModuleValue,
					publishStatus: body.publishStatus,
				};
			}
			throw new Error(updateErrorMessage);
		})
		.catch(() => {
			throw new Error(updateErrorMessage);
		});
};

const createTreeItem = (
	navModuleValue: ContentDetailCompartmentFormState,
	body: CreateTreeItemPayload
): Promise<ContentDetailCompartmentFormState> => {
	const createErrorMessage = 'Aanmaken van item in de navigatieboom is mislukt';
	return treesFacade
		.createTreeItem(navModuleValue.navigationTree, body)
		.then(response => {
			if (response) {
				return {
					...navModuleValue,
					id: response.id,
				};
			}
			throw new Error(createErrorMessage);
		})
		.catch(() => {
			throw new Error(createErrorMessage);
		});
};

const beforeSubmit = (
	activeCompartmentName: string,
	activeModuleValue: ModuleValue,
	contentItem: ContentSchema
): Promise<any> => {
	const navModuleValue = contentItem.modulesData?.navigation as ContentDetailCompartmentFormState;

	if (!navModuleValue) {
		return Promise.resolve();
	}

	const isCurrentActiveCompartment = activeCompartmentName === 'navigation';
	const navItemExist =
		navModuleValue.id !== undefined && navModuleValue.id !== null && navModuleValue.id !== '';
	const navItemIsPublished = navModuleValue.status === NAV_ITEM_STATUSES.PUBLISHED;
	const contentItemIsUnpublished = contentItem.meta.status === 'UNPUBLISHED';

	const shouldCreate = isCurrentActiveCompartment && !navItemExist;
	const shouldUpdate = isCurrentActiveCompartment && navItemExist;
	const shouldDepublish = navItemIsPublished && contentItemIsUnpublished;

	const body = shouldDepublish
		? getBody({
				...navModuleValue,
				status: NAV_ITEM_STATUSES.ARCHIVED,
		  })
		: getBody(navModuleValue);

	if (shouldCreate) {
		return createTreeItem(navModuleValue, body);
	}

	if (shouldUpdate || shouldDepublish) {
		return updateTreeItem(navModuleValue, body);
	}

	return Promise.resolve();
};

export default beforeSubmit;
