import { isNil } from '@datorama/akita';
import { ContentSchema } from '@redactie/content-module';

import { ContentCompartmentState } from '../../navigation.types';
import { CreateTreeItemPayload, UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';

const getBody = (
	moduleValue: ContentCompartmentState,
	contentItem: ContentSchema
): UpdateTreeItemPayload | CreateTreeItemPayload => {
	return {
		label: moduleValue.label ?? '',
		slug: contentItem?.meta.slug.nl ?? '',
		description: moduleValue.description ?? '',
		parentId:
			moduleValue.position?.length || 0 > 0
				? moduleValue.position && moduleValue.position[moduleValue.position.length - 1]
				: undefined,
		publishStatus: moduleValue.status ?? '',
	};
};

const localUpdateTreeItem = (
	navModuleValue: ContentCompartmentState,
	body: UpdateTreeItemPayload
): Promise<ContentCompartmentState> => {
	// Update local tree item state
	// Only update the local tree item when we know that the form is filled in correctly, we check for the label because it is
	// a required field inside the form
	// Everytime the user saves a content item we only save the navigation tree id and tree item id.
	// This means we modify the navModuleValue before the system will send it to the server
	// Therefore we need to hold the unchanged data in local state to update the tree item in the after submit hook.
	if (navModuleValue.label) {
		treeItemsFacade.localUpateTreeItem(navModuleValue.id, body);
		treeItemsFacade.addCurrentPosition(navModuleValue.position);
	}

	// Only save the tree and item id
	return Promise.resolve({
		id: navModuleValue.id,
		navigationTree: navModuleValue.navigationTree,
	});
};

const createTreeItem = (
	navModuleValue: ContentCompartmentState,
	body: CreateTreeItemPayload
): Promise<ContentCompartmentState> => {
	const createErrorMessage = 'Aanmaken van item in de navigatieboom is mislukt';
	return treeItemsFacade
		.createTreeItem(navModuleValue.navigationTree, body)
		.then(response => {
			if (response) {
				treeItemsFacade.addCurrentPosition(navModuleValue.position);
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

const beforeSubmit = (contentItem: ContentSchema): Promise<ContentCompartmentState | void> => {
	const navModuleValue = contentItem.modulesData?.navigation as ContentCompartmentState;
	if (!navModuleValue) {
		return Promise.resolve();
	}

	const navItemExist = !isNil(navModuleValue.id) && navModuleValue.id !== '';
	const body = getBody(navModuleValue, contentItem);

	return navItemExist
		? localUpdateTreeItem(navModuleValue, body)
		: createTreeItem(navModuleValue, body);
};

export default beforeSubmit;
