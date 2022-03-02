import { CascaderOption } from '../navigation.types';

export const getTreeConfig = <
	T extends { items: U[] },
	U extends { id?: number; label: string; items: U[] }
>(
	tree: T | undefined,
	treeItemId: number | string
): {
	options: CascaderOption[];
	activeItem: U | undefined;
} => {
	if (tree) {
		let activeItem;
		const mapTreeItemsToOptions = (items: U[]): CascaderOption[] => {
			return items
				.map((item: U) => {
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
