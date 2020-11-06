import { ContentSchema, ExternalCompartmentBeforeSubmitFn } from '@redactie/content-module';
import { ModuleValue } from '@redactie/content-module/dist/lib/services/content';

import { ContentCompartmentState } from '../../navigation.types';
import { CreateTreeItemPayload, UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';
import { isNotEmpty } from '../empty';

import { ERROR_MESSAGES } from './beforeAfterSubmit.const';

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
		treeItemsFacade.addPosition(navModuleValue.id, navModuleValue.position);
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
	return treeItemsFacade
		.createTreeItem(navModuleValue.navigationTree, body)
		.then(response => {
			if (response) {
				treeItemsFacade.addPosition(response.id, navModuleValue.position);
				// Only save the treeId and treeItemId on the content item
				return {
					id: String(response.id),
					navigationTree: navModuleValue.navigationTree,
				};
			}
			throw new Error(ERROR_MESSAGES.create);
		})
		.catch(() => {
			throw new Error(ERROR_MESSAGES.create);
		});
};

const deleteTreeItem = (
	navigationTree: string,
	navModuleValue: ContentCompartmentState
): Promise<ModuleValue> => {
	return treeItemsFacade
		.deleteTreeItem(navigationTree, navModuleValue.id)
		.then(() => {
			// remove all module values before saving the conent item
			return {};
		})
		.catch(() => {
			throw new Error(ERROR_MESSAGES.delete);
		});
};

const beforeSubmit: ExternalCompartmentBeforeSubmitFn = (
	contentItem,
	contentType,
	prevContentItem
) => {
	const navModuleValue = contentItem.modulesData?.navigation as ContentCompartmentState;
	const prevNavModuleValue = prevContentItem?.modulesData?.navigation as ContentCompartmentState;
	const slugHasChanged = contentItem?.meta.slug.nl !== prevContentItem?.meta.slug.nl;

	if (slugHasChanged) {
		treeItemsFacade.setSlugIsChanged(true);
	}

	if (!navModuleValue) {
		return Promise.resolve();
	}

	const navItemExist = isNotEmpty(navModuleValue.id);
	const prevNavigationTreeExist = isNotEmpty(prevNavModuleValue?.navigationTree);
	const navigationTreeExist = isNotEmpty(navModuleValue.navigationTree);
	const body = getBody(navModuleValue, contentItem);

	if (navItemExist && prevNavigationTreeExist && !navigationTreeExist) {
		return deleteTreeItem(prevNavModuleValue?.navigationTree, navModuleValue);
	}

	return navItemExist
		? localUpdateTreeItem(navModuleValue, body)
		: createTreeItem(navModuleValue, body);
};

export default beforeSubmit;
