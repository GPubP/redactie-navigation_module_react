import { api } from '../api';

import {
	Menu,
} from './menus.service.types';

export class MenusApiService {
	public async getMenus(
		siteId: string,
		): Promise<Menu[] | null> {
		try {
			const response: Menu[] = await api
				.get(`${siteId}/trees`)
				.json();

			if (!response) {
				throw new Error('Failed to get menus');
			}

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async getMenu(siteId: string, id: string): Promise<Menu | null> {
		try {
			const response: Menu = await api.get(`${siteId}/trees/${id}`).json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async createMenu(siteId: string, menu: Menu): Promise<Menu | null> {
		try {
			const response: Menu = await api
				.post(`${siteId}/trees`, {
					json: menu,
				})
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async updateMenu(siteId: string, menu: Menu): Promise<Menu | null> {
		try {
			const response: Menu = await api
				.put(`${siteId}/trees/${menu.id}`, {
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
