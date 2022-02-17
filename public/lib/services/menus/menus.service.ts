import { api } from '../api';

import { Menu, MenusResponse } from './menus.service.types';

export class MenusApiService {
	public async getMenus(siteId: string): Promise<Menu[] | null> {
		try {
			const response: MenusResponse = await api.get(`${siteId}/menus`).json();

			if (!response) {
				throw new Error('Failed to get menus');
			}

			return response._embedded.resourceList;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async getMenu(siteId: string, id: string): Promise<Menu | null> {
		try {
			const response: Menu = await api.get(`${siteId}/menus/${id}`).json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async createMenu(siteId: string, menu: Menu): Promise<Menu | null> {
		try {
			const response: Menu = await api
				.post(`${siteId}/menus`, {
					json: menu,
				})
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export const menusApiService = new MenusApiService();
