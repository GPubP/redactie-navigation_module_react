import { SiteStructureItem } from '../services/siteStructureItems';
import { SiteStructure } from '../services/siteStructures';

export const getAvailableSiteStructureOptions = (
	itemsToExclude: number[],
	siteStructure: SiteStructure
): SiteStructure | undefined => {
	if (!siteStructure) {
		return;
	}

	let availableStructure = siteStructure;

	const getItemsForId = (
		items: SiteStructureItem[],
		id: number
	): SiteStructureItem | undefined => {
		return items.find(i => i.id === id);
	};

	itemsToExclude.forEach(i => {
		if (availableStructure.items) {
			const result = getItemsForId(availableStructure.items, i);

			if (result) {
				availableStructure = {
					...availableStructure,
					items: result.items,
				};
			}
		} else {
			return availableStructure;
		}
	});

	return availableStructure;
};
