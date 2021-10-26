import { ContentSchema, ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';
import { SiteDetailModel } from '@redactie/sites-module';
import { omit } from 'ramda';

import { ContentDetailCompartmentFormState } from '../../components';
import { ContentCompartmentState } from '../../navigation.types';
import { TreeItem, UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';
import { isEmpty, isNotEmpty } from '../empty';
import { generateExternalUrl } from '../generateExternalUrl';
import { setTreeItemStatusByContent } from '../setTreeItemStatusByContentStatus';

import { ERROR_MESSAGES } from './beforeAfterSubmit.const';

const updateTreeItem = async (
	siteId: string,
	navModuleValue: ContentCompartmentState,
	body: UpdateTreeItemPayload
): Promise<void> => {
	return treeItemsFacade
		.updateTreeItem(siteId, navModuleValue.navigationTree, navModuleValue.id, body)
		.then(() => treeItemsFacade.localUpdateTreeItem(navModuleValue.id, body))
		.catch(() => {
			throw new Error(ERROR_MESSAGES.update);
		});
};

const handleTreeItemUpdate = (
	siteId: string,
	treeItem: TreeItem | undefined,
	navModuleValue: ContentCompartmentState,
	contentItem: ContentSchema | undefined,
	site?: SiteDetailModel
): Promise<void> => {
	if (!treeItem) {
		return Promise.resolve();
	}

	const body = setTreeItemStatusByContent(treeItem, contentItem, site);

	return updateTreeItem(siteId, navModuleValue, body);
};

const getPreviousFormState = (
	treeItem: Partial<TreeItem>,
	navigationTree: number,
	position: number[],
	contentItem: ContentSchema | undefined,
	site: SiteDetailModel | undefined
): ContentDetailCompartmentFormState => {
	return {
		id: treeItem?.id,
		navigationTree,
		position,
		label: treeItem?.label ?? '',
		slug: contentItem?.meta.slug.nl ?? '',
		externalUrl: generateExternalUrl(site, contentItem),
		description: treeItem?.description ?? '',
		status: treeItem?.publishStatus ?? '',
	};
};

const deleteTreeItem = (siteId: string, navModuleValue: ContentCompartmentState): Promise<void> => {
	return treeItemsFacade
		.deleteTreeItem(siteId, navModuleValue.navigationTree, navModuleValue.id)
		.then(() => {
			treeItemsFacade.removeFromCreatedTreeItems(navModuleValue.id);
			return;
		})
		.catch(() => {
			// TODO: Do we throw an error when it fails or do we resolve the promise
			// with the previous form data
			// Not resolving the promise will result in loosing the previous form data
			throw new Error(ERROR_MESSAGES.rollback);
		});
};

/**
 *
 * The afterSubmit hook
 * This function is called after submitting a content item.
 */
const afterSubmit: ExternalCompartmentAfterSubmitFn = (
	error,
	contentItem,
	contentType,
	prevContentItem,
	site
): Promise<ContentDetailCompartmentFormState | void> => {
	const navModuleValue = contentItem.modulesData?.navigation as ContentCompartmentState;
	const prevNavModuleValue = prevContentItem?.modulesData?.navigation as ContentCompartmentState;
	const siteId = contentItem.meta.site;

	// We can not update or delete the tree item if there is no navigation tree or tree item id available.
	if (!navModuleValue || isEmpty(navModuleValue.id) || isEmpty(navModuleValue.navigationTree)) {
		return Promise.resolve();
	}

	const prevTreeItem = treeItemsFacade.getTreeItem(prevNavModuleValue?.id);
	const prevCurrentPosition = treeItemsFacade.getPosition(prevNavModuleValue?.id);
	const treeItem = treeItemsFacade.getTreeItem(navModuleValue.id);
	const treeIsCreated = treeItemsFacade.isTreeCreated(navModuleValue.id);
	const currentPosition = treeItemsFacade.getPosition(navModuleValue.id);
	const contentItemDepsHaveChanged = treeItemsFacade.getContentItemDepsHaveChanged();
	const prevNavigationTreeExist = isNotEmpty(prevNavModuleValue?.navigationTree);
	const treeItemMovedToOtherTree =
		prevNavigationTreeExist &&
		prevNavModuleValue.navigationTree !== navModuleValue.navigationTree;

	/**
	 * Define rollback strategy
	 */
	if (error && treeItem) {
		return treeIsCreated
			? // We need to delete the created tree item after a content item has failed saving
			  deleteTreeItem(siteId, navModuleValue).then(() => {
					if (treeItemMovedToOtherTree) {
						return getPreviousFormState(
							prevTreeItem,
							prevNavModuleValue.navigationTree,
							prevCurrentPosition,
							contentItem,
							site
						);
					}
					return getPreviousFormState(
						omit(['id'], treeItem),
						navModuleValue.navigationTree,
						currentPosition,
						contentItem,
						site
					);
			  })
			: // Rollback changes after a content item has failed saving
			  // We only save the id and navigation tree on the content item
			  // therefore we need to rollback to the previous state
			  Promise.resolve(
					getPreviousFormState(
						treeItem,
						navModuleValue.navigationTree,
						currentPosition,
						contentItem,
						site
					)
			  );
	}

	// We can safely remove the current tree item from the created list since we know it already exist.
	treeItemsFacade.removeFromCreatedTreeItems(navModuleValue.id);

	const shouldUpdateTreeItem = !!treeItem || contentItemDepsHaveChanged;

	if (!shouldUpdateTreeItem) {
		return Promise.resolve();
	}

	const handleTreeItemUpdateActions = (treeItem: TreeItem): Promise<any> => {
		// Delete tree item from the navigation tree on which it was attached to
		if (treeItemMovedToOtherTree) {
			return treeItemsFacade.deleteTreeItem(
				siteId,
				prevNavModuleValue.navigationTree,
				prevNavModuleValue.id
			);
		}

		// Don't update the tree item when it is created in the before submit hook.
		// We know that the tree item has not changed.
		if (treeIsCreated) {
			return Promise.resolve();
		}

		// Update tree item
		return handleTreeItemUpdate(siteId, treeItem, navModuleValue, contentItem, site);
	};

	/**
	 * Update tree item
	 * We don't have a treeItem when the user has not visited the navigation compartment
	 * before saving the content item, so in that case we need to fetch the tree item from the server
	 * before we can update it properly.
	 */

	return !treeItem
		? treeItemsFacade
				.fetchTreeItem(siteId, navModuleValue.navigationTree, navModuleValue.id)
				.then(treeItem => handleTreeItemUpdateActions(treeItem as TreeItem))
		: handleTreeItemUpdateActions(treeItem);
};

export default afterSubmit;
