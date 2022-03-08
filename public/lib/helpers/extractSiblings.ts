import { MenuItem } from '../services/menuItems';

export const extractSiblings = (targetId: number, items: MenuItem[]): MenuItem[] => {
	return items.reduce((acc: MenuItem[], item: MenuItem) => {
		if (item.id === targetId) {
			return items;
		}

		if (item.items?.length) {
			return extractSiblings(targetId, item.items);
		}

		return acc;
	}, []);
};
