import { api } from '../api';

import {
	MenuSchema,
	MenusSchema,
} from './menus.service.types';

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
			const response: MenuSchema = await api.get(`sites/${siteId}/menus/${uuid}`).json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async updateMenu(siteId: string, menu: MenuSchema): Promise<MenuSchema | null> {
		try {
			const response: MenuSchema = await api
				.put(`sites/${siteId}/menus/${menu.uuid}`, {
					json: menu,
				})
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async createMenu(siteId: string, menu: MenuSchema): Promise<MenuSchema | null> {
		try {
			const response: MenuSchema = await api
				.post(`sites/${siteId}/menus`, {
					json: menu,
				})
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async deleteMenu(siteId: string, menuId: string): Promise<void> {
		return api.delete(`sites/${siteId}/menus/${menuId}`).json();
	}
}

export const menusApiService = new MenusApiService();
