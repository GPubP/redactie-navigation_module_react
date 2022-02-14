import { api } from '../api';

import {
	MenuSchema,
	MenusSchema,
} from './menus.service.types';

const MENU_MOCK: MenuSchema = {
	query: {},
	meta: {
		label: 'testMenu',
		description: 'Dit is een test'
	},
	uuid: '1234'
}

export class MenusApiService {
	public async getMenus(
		siteId: string,
		): Promise<MenusSchema | null> {
		try {
			const response: MenusSchema = await api
				.get(`sites/${siteId}/menus`)
				.json();

			if (!response._embedded) {
				throw new Error('Failed to get menus');
			}

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async getMenu(siteId: string, uuid: string): Promise<MenuSchema | null> {
		try {
			//const response: MenuSchema = await api.get(`sites/${siteId}/menus/${uuid}`).json();

			return MENU_MOCK;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async createMenu(siteId: string, menu: MenuSchema): Promise<MenuSchema | null> {
		try {
			/* const response: MenuSchema = await api
				.post(`sites/${siteId}/menus`, {
					json: menu,
				})
				.json(); */

			return MENU_MOCK;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export const menusApiService = new MenusApiService();
