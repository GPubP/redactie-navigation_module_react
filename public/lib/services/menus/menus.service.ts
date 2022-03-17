import { SearchParams } from '@redactie/utils';

import { UpdateNavTreeDTO } from '../../navigation.types';
import { api } from '../api';

import { CreateMenuDTO, Menu, MenusResponse, OccurrencesResponse } from './menus.service.types';

export class MenusApiService {
	public async getMenus(
		siteId: string,
		searchParams: SearchParams
	): Promise<MenusResponse | null> {
		return api
			.get(`${siteId}/menus`, {
				searchParams,
			})
			.json();
	}

	public async getMenu(siteId: string, id: string): Promise<Menu | null> {
		return api.get(`${siteId}/menus/${id}`).json();
	}

	public async createMenu(siteId: string, menu: CreateMenuDTO): Promise<Menu | null> {
		return api
			.post(`${siteId}/menus`, {
				json: menu,
			})
			.json();
	}

	public async updateMenu(siteId: string, menu: UpdateNavTreeDTO): Promise<Menu | null> {
		return api
			.put(`${siteId}/menus/${menu.id}`, {
				json: menu,
			})
			.json();
	}

	public async getOccurrences(siteId: string, id: string): Promise<OccurrencesResponse | null> {
		return api.get(`${siteId}/menus/${id}/content-type-occurrences`).json();
	}

	public async deleteMenu(siteId: string, menu: Menu): Promise<Response> {
		return api.delete(`${siteId}/menus/${menu.id}`);
	}
}

export const menusApiService = new MenusApiService();
