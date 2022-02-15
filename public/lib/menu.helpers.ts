import { Menu } from "./services/menus";

export const generateEmptyMenu = (siteName: string | undefined): Menu => ({
	label: '',
	description: '',
	publishStatus: 'draft',
	category: `menu_${siteName}_nl`,
});
