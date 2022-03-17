import { isNil } from 'ramda';

import { CascaderOption, NavItem, NavItemDetailForm } from '../navigation.types';

import { findPosition } from './findPosition';

export const getInitialNavItemsFormValues = (
	item: NavItem,
	options: CascaderOption[]
): NavItemDetailForm => {
	return {
		...(item || {}),
		position:
			!isNil(item?.parentId) && options.length > 0
				? findPosition(options, item?.parentId)
				: [],
	};
};
