import { SearchParams } from '@redactie/utils';

import { api } from '../api';

import { MenuItem, MenuItemsResponse } from './menuItems.service.types';

export class MenuItemsApiService {
	public async getMenuItems(
		siteId: string,
		menuId: string,
		searchParams: SearchParams
	): Promise<MenuItemsResponse> {
		return api
			.get(`${siteId}/menus/${menuId}/items`, {
				searchParams,
			})
			.json();
	}

	public async getMenuItem(siteId: string, menuId: string, id: string): Promise<MenuItem> {
		return api.get(`${siteId}/menus/${menuId}/items/${id}`).json();
	}

	public async createMenuItem(
		siteId: string,
		menuId: string,
		menuItem: MenuItem
	): Promise<MenuItem> {
		return api
			.post(`${siteId}/menus/${menuId}/items`, {
				json: menuItem,
			})
			.json();
	}

	public async updateMenuItem(
		siteId: string,
		menuId: string,
		menuItem: MenuItem
	): Promise<MenuItem> {
		return api
			.put(`${siteId}/menus/${menuId}/items/${menuItem.id}`, {
				json: menuItem,
			})
			.json();
	}

	public async deleteMenuItem(
		siteId: string,
		menuId: string,
		menuItem: MenuItem
	): Promise<Response> {
		return api.delete(`${siteId}/menus/${menuId}/items/${menuItem.id}`);
	}
}

export const menuItemsApiService = new MenuItemsApiService();
