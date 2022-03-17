import { NavItem, RearrangeNavItem } from '../navigation.types';

export const rearrangeItems = (items: NavItem[], rearrangeBody: RearrangeNavItem[]): NavItem[] => {
	return items.reduce((acc: NavItem[], item: NavItem, index: number) => {
		const rearrangeItem = rearrangeBody.find(r => r.itemId === item.id);

		if (rearrangeItem) {
			const newArr = [...items];
			newArr.sort((a, b) => {
				const rearrangeItem1 = rearrangeBody.find(
					rearrangeItem => rearrangeItem.itemId === a.id
				);
				const rearrangeItem2 = rearrangeBody.find(
					rearrangeItem => rearrangeItem.itemId === b.id
				);

				return (rearrangeItem1?.newWeight || 0) > (rearrangeItem2?.newWeight || 0) ? 1 : -1;
			});
			return newArr;
		}

		if (item.items?.length) {
			const newArr = [...acc];
			newArr[index] = {
				...newArr[index],
				items: rearrangeItems(item.items, rearrangeBody),
			};
			return newArr;
		}

		return acc;
	}, items);
};
