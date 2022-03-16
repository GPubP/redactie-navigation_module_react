import { NAV_STATUSES } from '../components';
import { MenuItem } from '../services/menuItems';

export const generateEmptyNavItem = (): MenuItem => ({
	description: '',
	label: '',
	logicalId: '',
	publishStatus: NAV_STATUSES.DRAFT,
	slug: '',
	externalUrl: '',
	items: [],
});
