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
			Array.isArray(moduleValue.position) && moduleValue.position.length > 0
				? moduleValue.position[moduleValue.position.length - 1]
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
	siteId: string,
	prevNavModuleValue: ContentCompartmentState,
	navModuleValue: ContentCompartmentState,
	body: CreateTreeItemPayload,
	treeItemMovedToOtherTree = false
): Promise<ContentCompartmentState> => {
	return treeItemsFacade
		.createTreeItem(siteId, navModuleValue.navigationTree, body)
		.then(response => {
			if (response) {
				treeItemsFacade.addPosition(response.id, navModuleValue.position);
				if (treeItemMovedToOtherTree) {
					treeItemsFacade.addPosition(prevNavModuleValue.id, prevNavModuleValue.position);
				}
				// Only save the treeId and treeItemId on the content item
				return {
					id: response.id,
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
	siteId: string,
	navigationTree: number,
	navModuleValue: ContentCompartmentState
): Promise<ModuleValue> => {
	return treeItemsFacade
		.deleteTreeItem(siteId, navigationTree, navModuleValue.id)
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
	const siteId = contentItem.meta.site;

	if (slugHasChanged) {
		treeItemsFacade.setSlugIsChanged(true);
	}

	if (!navModuleValue) {
		return Promise.resolve();
	}

	const navItemExist = isNotEmpty(navModuleValue.id);
	const prevNavigationTreeExist = isNotEmpty(prevNavModuleValue?.navigationTree);
	const navigationTreeExist = isNotEmpty(navModuleValue.navigationTree);
	const treeItemMovedToOtherTree =
		prevNavigationTreeExist &&
		navigationTreeExist &&
		prevNavModuleValue.navigationTree !== navModuleValue.navigationTree;
	const body = getBody(navModuleValue, contentItem);

	if (navItemExist && prevNavigationTreeExist && !navigationTreeExist) {
		return deleteTreeItem(siteId, prevNavModuleValue?.navigationTree, navModuleValue);
	}

	return navItemExist && !treeItemMovedToOtherTree
		? localUpdateTreeItem(navModuleValue, body)
		: createTreeItem(
				siteId,
				prevNavModuleValue,
				navModuleValue,
				body,
				treeItemMovedToOtherTree
		  );
};

export default beforeSubmit;
