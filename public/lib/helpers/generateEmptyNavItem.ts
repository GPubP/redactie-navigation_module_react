import { NAV_STATUSES } from '../components';
import { NavItemType } from '../navigation.types';
import { MenuItem } from '../services/menuItems';

export const generateEmptyNavItem = (type: NavItemType = NavItemType.internal): MenuItem => ({
	description: '',
	label: '',
	logicalId: '',
	publishStatus: NAV_STATUSES.DRAFT,
	slug: '',
	externalUrl: '',
	items: [],
	properties: {
		type,
	},
});
