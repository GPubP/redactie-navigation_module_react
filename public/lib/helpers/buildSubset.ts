import { MenuItem } from '../services/menuItems';

const recursiveFind = (
	items: MenuItem[],
	itemsToAppend: MenuItem[],
	parentId: number
): MenuItem[] => {
	return items.map((item: MenuItem) => {
		if (item.id === parentId) {
			item = {
				...item,
				items: itemsToAppend,
			};
		}

		if ((item.items || []).length) {
			item = {
				...item,
				items: recursiveFind(item.items, itemsToAppend, parentId),
			};
		}

		return item;
	});
};

export const buildSubset = (
	items: MenuItem[],
	itemsToAppend: MenuItem[],
	parentId: number
): MenuItem[] => {
	const updatedExisting = recursiveFind(items, itemsToAppend, parentId);

	if (updatedExisting.length) {
		return updatedExisting;
	}

	return itemsToAppend;
};
