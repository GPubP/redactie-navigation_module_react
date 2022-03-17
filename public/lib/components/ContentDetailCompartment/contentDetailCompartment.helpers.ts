import { ContentSchema } from '@redactie/content-module';
import { isEmpty, isNil } from 'ramda';

import { findPosition } from '../../helpers';
import { CascaderOption } from '../../navigation.types';
import { TreeDetailItem } from '../../services/trees';
import { TreeItemModel } from '../../store/treeItems';

import { NAV_STATUSES, STATUS_OPTIONS } from './ContentDetailCompartment.const';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getInitialFormValues = (
	value: any,
	treeItem: TreeItemModel | undefined,
	options: CascaderOption[],
	itemNotFound: boolean
) => {
	if ((!treeItem && isEmpty(value)) || itemNotFound) {
		return {
			status: NAV_ITEM_STATUSES.READY,
		};
	}

	return {
		id: value.id ?? undefined,
		navigationTree: value.navigationTree ?? '',
		position: value.position
			? value.position
			: !isNil(treeItem?.parentId) && options.length > 0
			? findPosition(options, treeItem?.parentId)
			: [],
		label: value.label ?? treeItem?.label ?? '',
		description: value.description ?? treeItem?.description ?? '',
		status: value.status ?? treeItem?.publishStatus ?? NAV_ITEM_STATUSES.READY,
		replaceItem: value.replaceItem ?? false,
	};
};

export const getStatusOptions = (
	contentItem: ContentSchema | undefined,
	contentValue: ContentSchema | undefined,
	status: string
): { label: string; value: string }[] => {
	if (
		(contentValue?.meta.status === 'UNPUBLISHED' && status !== NAV_STATUSES.PUBLISHED) ||
		!contentValue?.meta?.historySummary?.published
	) {
		return STATUS_OPTIONS.filter(
			statusOption => statusOption.value !== NAV_STATUSES.PUBLISHED
		);
	}

	return STATUS_OPTIONS;
};

export const hasTreeItemHasChildItems = (activeItem: TreeDetailItem | undefined): boolean => {
	if (activeItem) {
		return Array.isArray(activeItem.items) && activeItem.items.length > 0;
	}
	return false;
};
