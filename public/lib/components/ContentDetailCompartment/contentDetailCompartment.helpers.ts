import { ContentSchema } from '@redactie/content-module';
import arrayTreeFilter from 'array-tree-filter';
import { isNil } from 'ramda';

import { CascaderOption } from '../../navigation.types';
import { TreeDetail, TreeDetailItem } from '../../services/trees';
import { TreeItemModel } from '../../store/treeItems';

import { NAV_ITEM_STATUSES, STATUS_OPTIONS } from './ContentDetailCompartment.const';

export const getPositionInputValue = (options: CascaderOption[], inputValue: number[]): string => {
	return arrayTreeFilter(options, (o, level) => o.value === inputValue[level])
		.map(o => o.label)
		.join(' > ');
};

export const findPosition = (treeOptions: CascaderOption[], treeItemId?: number): number[] => {
	const reduceTreeOptions = (options: CascaderOption[]): number[] => {
		return options.reduce((acc, option) => {
			if (option.value == treeItemId) {
				acc.push(option.value);
				return acc;
			}

			if (option.children && option.children.length > 0) {
				const childrenValue = reduceTreeOptions(option.children);

				if (childrenValue && childrenValue.length > 0) {
					return [option.value, ...childrenValue];
				}
			}

			return acc;
		}, [] as number[]);
	};

	return reduceTreeOptions(treeOptions);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getInitialFormValues = (
	value: any,
	treeItem: TreeItemModel | undefined,
	options: CascaderOption[]
) => {
	if (!treeItem) {
		return {
			status: STATUS_OPTIONS[0].value,
		};
	}

	return {
		id: value.id ?? undefined,
		navigationTree: value.navigationTree ?? '',
		position:
			!isNil(treeItem?.parentId) && options.length > 0
				? findPosition(options, treeItem?.parentId)
				: value.position
				? value.position
				: [],
		label: treeItem?.label ?? value.label ?? '',
		description: treeItem?.description ?? value.description ?? '',
		status: treeItem?.publishStatus ?? value.status ?? STATUS_OPTIONS[0].value,
		replaceItem: false,
	};
};

export const getTreeConfig = (
	tree: TreeDetail | undefined,
	treeItemId: number | string
): {
	options: CascaderOption[];
	activeItem: TreeDetailItem | undefined;
} => {
	if (tree) {
		let activeItem;
		const mapTreeItemsToOptions = (items: TreeDetailItem[]): CascaderOption[] => {
			return items
				.map((item: TreeDetailItem) => {
					// Filter out the current navigation item from the position list
					// The user can not set the current navigation item as the position in the
					// navigation tree because it will create a circular dependency
					const parsedTreeItemId =
						typeof treeItemId === 'string' ? parseInt(treeItemId, 10) : treeItemId;
					if (item.id === parsedTreeItemId) {
						activeItem = item;
						return null;
					}
					return {
						value: item.id,
						label: item.label,
						children: mapTreeItemsToOptions(item.items || []),
					};
				})
				.filter(item => item !== null) as CascaderOption[];
		};
		return {
			options: mapTreeItemsToOptions(tree.items || []),
			activeItem,
		};
	}
	return {
		options: [],
		activeItem: undefined,
	};
};

export const getStatusOptions = (
	contentItem: ContentSchema | undefined,
	contentValue: ContentSchema | undefined,
	status: string
): { label: string; value: string }[] => {
	if (
		(contentValue?.meta.status === 'UNPUBLISHED' && status !== NAV_ITEM_STATUSES.PUBLISHED) ||
		!contentValue?.meta?.historySummary?.published
	) {
		return STATUS_OPTIONS.filter(
			statusOption => statusOption.value !== NAV_ITEM_STATUSES.PUBLISHED
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
