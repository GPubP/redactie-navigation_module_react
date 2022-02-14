import { Menu } from "./services/menus";

export const generateEmptyMenu = (): Menu => ({
	label: '',
	description: '',
	publishStatus: 'draft',
	categoryId: 35,
});
