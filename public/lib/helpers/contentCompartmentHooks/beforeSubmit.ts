import { ContentSchema, ModuleValue } from '@redactie/content-module';

import { ContentDetailCompartmentFormState } from '../../components';
import { ContentCompartmentState } from '../../navigation.types';
import { CreateTreeItemPayload, UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';

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
): Promise<ContentCompartmentState> => {
	const updateErrorMessage = 'Wijzigen van het item in de navigatieboom is mislukt';
	return treeItemsFacade
		.updateTreeItem(navModuleValue.navigationTree, navModuleValue.id || '', body)
		.then(response => {
			if (response) {
				// Only save the treeId and treeItemId on the content item
				return {
					id: response.id,
					navigationTree: navModuleValue.navigationTree,
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
): Promise<ContentCompartmentState> => {
	const createErrorMessage = 'Aanmaken van item in de navigatieboom is mislukt';
	return treeItemsFacade
		.createTreeItem(navModuleValue.navigationTree, body)
		.then(response => {
			if (response) {
				// Only save the treeId and treeItemId on the content item
				return {
					id: response.id,
					navigationTree: navModuleValue.navigationTree,
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
	const shouldCreate = isCurrentActiveCompartment && !navItemExist;
	const shouldUpdate = isCurrentActiveCompartment && navItemExist;

	if (shouldCreate) {
		return createTreeItem(navModuleValue, getBody(navModuleValue));
	}

	if (shouldUpdate) {
		return updateTreeItem(navModuleValue, getBody(navModuleValue));
	}

	return Promise.resolve();
};

export default beforeSubmit;
