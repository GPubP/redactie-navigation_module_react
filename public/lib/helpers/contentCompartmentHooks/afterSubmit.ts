import { ContentSchema, ModuleValue } from '@redactie/content-module';
import { omit } from 'ramda';

import { ContentDetailCompartmentFormState, NAV_ITEM_STATUSES } from '../../components';
import { UpdateTreeItemPayload } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';

const updateTreeItem = (
	navModuleValue: ContentDetailCompartmentFormState,
	body: UpdateTreeItemPayload
): Promise<void> => {
	const updateErrorMessage = 'Wijzigen van het item in de navigatieboom is mislukt';
	return treeItemsFacade
		.updateTreeItem(navModuleValue.navigationTree, navModuleValue.id || '', body)
		.then(() => {
			return;
		})
		.catch(() => {
			throw new Error(updateErrorMessage);
		});
};

const afterSubmit = (
	error: Error | undefined,
	activeCompartmentName: string,
	activeModuleValue: ModuleValue,
	contentItem: ContentSchema
): Promise<any> => {
	const navModuleValue = contentItem.modulesData?.navigation as ContentDetailCompartmentFormState;
	const treeItem = treeItemsFacade.getTreeItem(navModuleValue.id as string);

	if (error || !navModuleValue || !treeItem) {
		return Promise.resolve();
	}

	const navItemIsPublished = treeItem.publishStatus === NAV_ITEM_STATUSES.PUBLISHED;
	const contentItemIsUnpublished = contentItem.meta.status === 'UNPUBLISHED';
	const shouldDepublish = navItemIsPublished && contentItemIsUnpublished;

	const body = {
		...omit(['weight'], treeItem),
		publishStatus: NAV_ITEM_STATUSES.ARCHIVED,
	};

	if (shouldDepublish) {
		return updateTreeItem(navModuleValue, body);
	}

	return Promise.resolve();
};

export default afterSubmit;
