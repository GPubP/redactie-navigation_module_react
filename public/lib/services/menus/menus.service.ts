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
				.get(`${siteId}/trees`)
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
			const response: MenuSchema = await api.get(`${siteId}/trees/${uuid}`).json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async createMenu(siteId: string, menu: MenuSchema): Promise<MenuSchema | null> {
		try {
			const response: MenuSchema = await api
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
}

export const menusApiService = new MenusApiService();
