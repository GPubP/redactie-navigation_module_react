import { ContentSchema, ExternalCompartmentAfterSubmitFn } from '@redactie/content-module';
import { equals, omit } from 'ramda';

import { ContentDetailCompartmentFormState, NAV_ITEM_STATUSES } from '../../components';
import { ContentCompartmentState } from '../../navigation.types';
import { TreeItem, UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';
import { isEmpty, isNotEmpty } from '../empty';

import { ERROR_MESSAGES } from './beforeAfterSubmit.const';

const updateTreeItem = (
	navModuleValue: ContentCompartmentState,
	body: UpdateTreeItemPayload
): Promise<void> => {
	return treeItemsFacade
		.updateTreeItem(navModuleValue.navigationTree, navModuleValue.id, body)
		.catch(() => {
			throw new Error(ERROR_MESSAGES.update);
		});
};

const handleTreeItemUpdate = (
	treeItem: TreeItem | undefined | void,
	navModuleValue: ContentCompartmentState,
	contentItem: ContentSchema
): Promise<void> => {
	if (!treeItem) {
		return Promise.resolve();
	}

	const navItemIsPublished = treeItem.publishStatus === NAV_ITEM_STATUSES.PUBLISHED;
	const contentItemIsUnpublished = contentItem.meta.status === 'UNPUBLISHED';
	const shouldDepublish = navItemIsPublished && contentItemIsUnpublished;
	const updateData = omit(['weight'], {
		...treeItem,
		slug: contentItem?.meta.slug.nl ?? '',
	});

	const body = shouldDepublish
		? {
				...updateData,
				publishStatus: NAV_ITEM_STATUSES.ARCHIVED,
		  }
		: updateData;

	return updateTreeItem(navModuleValue, body);
};

const getPreviousFormState = (
	treeItem: Partial<TreeItem>,
	navigationTree: string,
	position: string[],
	contentItem: ContentSchema
): ContentDetailCompartmentFormState => {
	return {
		id: treeItem.id,
		navigationTree,
		position,
		label: treeItem.label ?? '',
		slug: contentItem?.meta.slug.nl ?? '',
		description: treeItem.description ?? '',
		status: treeItem.publishStatus ?? '',
	};
};

const deleteTreeItem = (
	navModuleValue: ContentCompartmentState,
	treeItem: TreeItem,
	contentItem: ContentSchema,
	currentPosition: string[]
): Promise<ContentDetailCompartmentFormState> => {
	return treeItemsFacade
		.deleteTreeItem(navModuleValue.navigationTree, navModuleValue.id)
		.then(() => {
			treeItemsFacade.removeFromCreatedTreeItems(navModuleValue.id);
			return getPreviousFormState(
				omit(['id'], treeItem),
				navModuleValue.navigationTree,
				currentPosition,
				contentItem
			);
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
	prevContentItem
): Promise<ContentDetailCompartmentFormState | void> => {
	const navModuleValue = contentItem.modulesData?.navigation as ContentCompartmentState;
	const prevNavModuleValue = prevContentItem?.modulesData?.navigation as ContentCompartmentState;

	// We can not update or delete the tree item if there is no navigation tree or tree item id available.
	if (!navModuleValue || isEmpty(navModuleValue.id) || isEmpty(navModuleValue.navigationTree)) {
		return Promise.resolve();
	}

	const treeItem = treeItemsFacade.getTreeItem(navModuleValue.id);
	const treeIsCreated = treeItemsFacade.isTreeCreated(navModuleValue.id);
	const currentPosition = treeItemsFacade.getPosition(navModuleValue.id);
	const slugHasChanged = treeItemsFacade.getSlugIsChanged();
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
			  deleteTreeItem(navModuleValue, treeItem, contentItem, currentPosition)
			: // Rollback changes after a content item has failed saving
			  // We only save the id and navigation tree on the content item
			  // therefore we need to rollback to the previous state
			  Promise.resolve(
					getPreviousFormState(
						treeItem,
						navModuleValue.navigationTree,
						currentPosition,
						contentItem
					)
			  );
	}

	// We can safely remove the curent tree item from the created list since we know it already exist.
	treeItemsFacade.removeFromCreatedTreeItems(navModuleValue.id);

	const shouldUpdateTreeItem = !equals(navModuleValue, prevNavModuleValue) || slugHasChanged;

	if (!shouldUpdateTreeItem) {
		return Promise.resolve();
	}

	const handleTreeItemUpdateActions = (treeItem: TreeItem): Promise<any> => {
		// Delete tree item from the navigation tree on which it was attached to
		if (treeItemMovedToOtherTree) {
			return treeItemsFacade.deleteTreeItem(
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
		return handleTreeItemUpdate(treeItem, navModuleValue, contentItem);
	};

	/**
	 * Update tree item
	 * We don't have a treeItem when the user has not visited the navigation compartment
	 * before saving the content item, so in that case we need to fetch the tree item from the server
	 * before we can update it properly.
	 */
	return !treeItem
		? treeItemsFacade
				.fetchTreeItem(navModuleValue.navigationTree, navModuleValue.id)
				.then(treeItem => handleTreeItemUpdateActions(treeItem as TreeItem))
		: handleTreeItemUpdateActions(treeItem);
};

export default afterSubmit;
