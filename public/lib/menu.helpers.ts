import { MenuItem } from './services/menuItems';
import { Menu } from './services/menus';
import { LANG_OPTIONS } from './views/MenuDetailSettings/MenuDetailSettings.const';

export const generateEmptyMenu = (siteName: string | undefined): Menu => ({
	label: '',
	description: '',
	lang: LANG_OPTIONS[0].value,
	publishStatus: 'draft',
	category: `menu_${siteName}_nl`,
});

export const generateEmptyMenuItem = (menuId: string): MenuItem => ({
	parentId: menuId,
	label: '',
	description: '',
	publishStatus: 'draft',
});
