import { NavItem } from '../navigation.types';

export const getAvailableSiteStructureOptions = (
	itemsToExclude: number[],
	siteStructure: any
): NavItem | undefined => {
	if (!siteStructure) {
		return;
	}

	let availableStructure = siteStructure;

	const getItemsForId = (items: NavItem[], id: number): NavItem | undefined => {
		return items.find(i => i.id === id);
	};
	itemsToExclude.forEach(i => {
		if (availableStructure.items) {
			const result = getItemsForId(availableStructure.items, i);
			if (result) {
				availableStructure = result;
			}
		} else {
			return availableStructure;
		}
	});

	return availableStructure;
};
