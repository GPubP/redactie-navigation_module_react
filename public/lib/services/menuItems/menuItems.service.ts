import { SearchParams } from '@redactie/utils';

import { api } from '../api';

import { MenuItem, MenuItemsResponse } from './menuItems.service.types';

const ITEM_MOCK: MenuItem = {
	id: 1,
	label: 'test',
	description: 'dit is een test',
};

export class MenuItemsApiService {
	public async getMenuItems(
		siteId: string,
		menuId: string,
		searchParams: SearchParams
	): Promise<MenuItemsResponse | null> {
		try {
			const response: MenuItemsResponse = await api
				.get(`${siteId}/menus/${menuId}/items`, {
					searchParams,
				})
				.json();

			if (!response) {
				throw new Error('Failed to get items');
			}

			return response;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async getMenuItem(siteId: string, menuId: string, id: string): Promise<MenuItem | null> {
		try {
			/* const response: MenuItem = await api
				.get(`${siteId}/menus/${menuId}/items/${id}`)
				.json(); */

			return ITEM_MOCK;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async createMenuItem(
		siteId: string,
		menuId: string,
		menuItem: MenuItem
	): Promise<MenuItem | null> {
		try {
			/* const response: MenuItem = await api
				.post(`${siteId}/menus/${menuId}/items`, {
					json: menuItem,
				})
				.json(); */

			return ITEM_MOCK;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async updateMenuItem(
		siteId: string,
		menuId: string,
		menuItem: MenuItem
	): Promise<MenuItem | null> {
		try {
			/* const response: MenuItem = await api
				.put(`${siteId}/menus/${menuId}/items/${menuItem.id}`, {
					json: menuItem,
				})
				.json(); */

			return ITEM_MOCK;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	public async deleteMenuItem(
		siteId: string,
		menuId: string,
		menuItem: MenuItem
	): Promise<Response> {
		return await api.delete(`${siteId}/menus/${menuId}/items/${menuItem.id}`);
	}
}

export const menuItemsApiService = new MenuItemsApiService();
