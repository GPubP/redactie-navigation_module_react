import { ContentSchema, ExternalCompartmentBeforeSubmitFn } from '@redactie/content-module';
import { ModuleValue } from '@redactie/content-module/dist/lib/services/content';

import { ContentCompartmentState } from '../../navigation.types';
import { CreateTreeItemPayload, UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';
import { treesFacade } from '../../store/trees';
import { isNotEmpty } from '../empty';
import { setTreeItemStatusByContent } from '../setTreeItemStatusByContentStatus';

import { ERROR_MESSAGES } from './beforeAfterSubmit.const';

const getBody = (
	moduleValue: ContentCompartmentState,
	contentItem: ContentSchema
): UpdateTreeItemPayload | CreateTreeItemPayload => {
	const position: number[] | undefined =
		Array.isArray(moduleValue.position) && moduleValue.replaceItem
			? moduleValue.position.slice(0, -1)
			: moduleValue.position;

	return {
		label: moduleValue.label ?? '',
		slug: contentItem?.meta.slug.nl ?? '',
		description: moduleValue.description ?? '',
		parentId:
			Array.isArray(position) && position.length > 0
				? position[position.length - 1]
				: undefined,
		publishStatus: moduleValue.status ?? '',
	};
};

const localUpdateTreeItem = async (
	siteId: string,
	navModuleValue: ContentCompartmentState,
	body: UpdateTreeItemPayload
): Promise<ContentCompartmentState> => {
	// If item should be replaced, de id needs to be the last position
	const id =
		navModuleValue.replaceItem &&
		Array.isArray(navModuleValue.position) &&
		navModuleValue.position.length
			? navModuleValue.position[navModuleValue.position.length - 1]
			: navModuleValue.id;
	// Update local tree item state
	// Only update the local tree item when we know that the form is filled in correctly, we check for the label because it is
	// a required field inside the form
	// Everytime the user saves a content item we only save the navigation tree id and tree item id.
	// This means we modify the navModuleValue before the system will send it to the server
	// Therefore we need to hold the unchanged data in local state to update the tree item in the after submit hook.
	if (navModuleValue.label) {
		await treeItemsFacade.fetchTreeItem(siteId, navModuleValue.navigationTree, id);
		treeItemsFacade.localUpdateTreeItem(id, body);
		treeItemsFacade.addPosition(id, navModuleValue.position);
	}

	// Only save the tree and item id
	return Promise.resolve({
		id,
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
				treesFacade.fetchTree(siteId, navModuleValue.navigationTree, true);
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

const deleteTreeItem = async (
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
	const contentItemDepsHaveChanged =
		contentItem?.meta.slug.nl !== prevContentItem?.meta.slug.nl ||
		(['UNPUBLISHED', 'PUBLISHED'].includes(contentItem.meta.status) &&
			contentItem.meta.status !== prevContentItem?.meta.status);
	const siteId = contentItem.meta.site;

	if (contentItemDepsHaveChanged) {
		treeItemsFacade.setContentItemDepsHaveChanged(true);
	}

	if (!navModuleValue) {
		return Promise.resolve();
	}

	const navItemExist = isNotEmpty(navModuleValue.id); // TreeItem does not exist but the item it replaces, does
	const navItemShouldReplaceParent = navModuleValue.replaceItem;
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

	const payload = setTreeItemStatusByContent(body, contentItem);

	return navItemShouldReplaceParent || (navItemExist && !treeItemMovedToOtherTree)
		? localUpdateTreeItem(siteId, navModuleValue, payload)
		: createTreeItem(
				siteId,
				prevNavModuleValue,
				navModuleValue,
				payload,
				treeItemMovedToOtherTree
		  );
};

export default beforeSubmit;
