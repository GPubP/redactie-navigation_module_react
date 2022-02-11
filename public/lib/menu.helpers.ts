import { MenuSchema } from "./services/menus";

export const generateEmptyMenu = (): MenuSchema => ({
	meta: {
		description: '',
		label: '',
		site: '',
	},
	query: {
		options: {
			offset: 0,
			limit: 0,
			order: 'asc',
		},
	},
});
