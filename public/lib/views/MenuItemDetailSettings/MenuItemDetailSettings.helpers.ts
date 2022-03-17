import { isNil } from 'ramda';

import { findPosition } from '../../helpers/findPosition';
import { CascaderOption } from '../../navigation.types';
import { MenuItem } from '../../services/menuItems';

import { MenuItemDetailForm } from './MenuItemDetailSettings.types';

export const getInitialFormValues = (
	menuItem: MenuItem,
	options: CascaderOption[]
): MenuItemDetailForm => {
	return {
		...(menuItem || {}),
		position:
			!isNil(menuItem?.parentId) && options.length > 0
				? findPosition(options, menuItem?.parentId)
				: [],
	};
};
