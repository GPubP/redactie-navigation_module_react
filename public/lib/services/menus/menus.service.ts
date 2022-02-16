import { api } from '../api';

import { Menu, OccurrencesResponse } from './menus.service.types';

export class MenusApiService {
	public async getMenus(siteId: string): Promise<Menu[] | null> {
		try {
			const response: Menu[] = await api.get(`${siteId}/menus`).json();

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

	public async getOccurrences(siteId: string, id: string): Promise<OccurrencesResponse | null> {
		try {
			const response: OccurrencesResponse = await api
				.get(`${siteId}/menus/${id}/content-type-occurrences`)
				.json();

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export const menusApiService = new MenusApiService();
