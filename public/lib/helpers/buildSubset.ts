import { MenuItem } from '../services/menuItems';

const recursiveFind = (
	items: MenuItem[],
	itemsToAppend: MenuItem[],
	parentId: number,
	accumulator: { parentFound: boolean; items: MenuItem[] }
): { parentFound: boolean; items: MenuItem[] } => {
	return items.reduce(
		(acc: { parentFound: boolean; items: MenuItem[] }, item: MenuItem) => {
			if (item.id === parentId) {
				item = {
					...item,
					items: itemsToAppend,
				};
				accumulator.parentFound = true;
			}

			if ((item.items || []).length) {
				const rec = recursiveFind(item.items, itemsToAppend, parentId, accumulator);

				item = {
					...item,
					items: rec.items,
				};
			}

			return {
				parentFound: accumulator.parentFound,
				items: [...acc.items, item],
			};
		},
		{
			parentFound: false,
			items: [],
		}
	);
};

export const buildSubset = (
	items: MenuItem[],
	itemsToAppend: MenuItem[],
	parentId: number
): MenuItem[] => {
	const res = recursiveFind(items, itemsToAppend, parentId, {
		parentFound: false,
		items: [],
	});

	return res.parentFound ? res.items : itemsToAppend;
};
