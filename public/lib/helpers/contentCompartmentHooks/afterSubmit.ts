import { ContentSchema } from '@redactie/content-module';
import { ContentCompartmentState } from '@redactie/content-module/dist/lib/store/ui/contentCompartments';
import { omit } from 'ramda';

import { ContentDetailCompartmentFormState, NAV_ITEM_STATUSES } from '../../components';
import { TreeItem, UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';

const updateTreeItem = (
	navModuleValue: ContentCompartmentState,
	body: UpdateTreeItemPayload
): Promise<void> => {
	const updateErrorMessage = 'Wijzigen van het item in de navigatieboom is mislukt';
	return treeItemsFacade
		.updateTreeItem(navModuleValue.navigationTree, navModuleValue.id, body)
		.catch(() => {
			throw new Error(updateErrorMessage);
		});
};

const handleFetchTreeItemResponse = (
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
	navModuleValue: ContentCompartmentState,
	currentPosition: string[],
	contentItem: ContentSchema
): ContentDetailCompartmentFormState => {
	return {
		id: treeItem.id,
		navigationTree: navModuleValue.navigationTree,
		position: currentPosition,
		label: treeItem.label ?? '',
		slug: contentItem?.meta.slug.nl ?? '',
		description: treeItem.description ?? '',
		status: treeItem.publishStatus ?? '',
	};
};

const afterSubmit = (
	error: Error | undefined,
	contentItem: ContentSchema
): Promise<ContentDetailCompartmentFormState | void> => {
	const navModuleValue = contentItem.modulesData?.navigation as ContentCompartmentState;

	if (!navModuleValue || !navModuleValue.id) {
		return Promise.resolve();
	}

	// The beforeSubmit hook is only responsible to creating new tree items
	// The afterSubmit hook is responsible for updating the tree items and execute rollbacks
	// when there are errors
	if (error) {
		const treeItem = treeItemsFacade.getTreeItem(navModuleValue.id);
		const currentPosition = treeItemsFacade.getCurrentPosition();
		// We need to delete the created tree item after a content item has failed saving
		if (treeItemsFacade.isTreeCreated(navModuleValue.id)) {
			// Rollback create
			return treeItemsFacade
				.deleteTreeItem(navModuleValue.navigationTree, navModuleValue.id)
				.then(() => {
					treeItemsFacade.removeFromCreatedTreeItems(navModuleValue.id);
					return getPreviousFormState(
						omit(['id'], treeItem),
						navModuleValue,
						currentPosition,
						contentItem
					);
				})
				.catch(() => {
					// TODO: Do we throw an error when it fails or do we resolve the promise
					// with the previous form data
					// Not resolving the promise will result in loosing the previous form data
					throw new Error('Terugrollen aanmaak navigatie item is mislukt');
				});
		}
		// Rollback form data
		if (treeItem) {
			// rollback changes after the conent item has failed saving
			// We only save the id and navigation tree on the content type
			// therefore we need to rollback to the previous state
			return Promise.resolve(
				getPreviousFormState(treeItem, navModuleValue, currentPosition, contentItem)
			);
		}
		return Promise.resolve();
	}

	treeItemsFacade.removeFromCreatedTreeItems(navModuleValue.id);

	return treeItemsFacade
		.fetchTreeItem(navModuleValue.navigationTree, navModuleValue.id)
		.then(treeItem => handleFetchTreeItemResponse(treeItem, navModuleValue, contentItem));
};

export default afterSubmit;
