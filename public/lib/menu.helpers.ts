import { NAV_STATUSES } from './components';
import { MenuItem } from './services/menuItems';
import { Menu } from './services/menus';
import { LANG_OPTIONS } from './views/MenuDetailSettings/MenuDetailSettings.const';

export const generateEmptyMenu = (siteName: string | undefined): Menu => ({
	label: '',
	description: '',
	lang: LANG_OPTIONS[0].value,
	publishStatus: NAV_STATUSES.DRAFT,
	category: `menu_${siteName}_nl`,
	items: [],
	slug: '',
});

export const generateEmptyMenuItem = (): MenuItem => ({
	description: '',
	label: '',
	logicalId: '',
	publishStatus: NAV_STATUSES.DRAFT,
	slug: '',
	externalUrl: '',
	items: [],
});
