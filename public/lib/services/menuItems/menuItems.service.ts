import { SearchParams } from '@redactie/utils';

import { RearrangeNavItem } from '../../navigation.types';
import { PendingMenuItems } from '../../store/menuItems';
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

	public async getContentMenuItems(
		siteId: string,
		contentId: string,
		searchParams: SearchParams
	): Promise<MenuItemsResponse> {
		return api
			.get(`${siteId}/content/${contentId}/menu-items`, {
				searchParams,
			})
			.json();
	}

	public async getSubset(
		siteId: string,
		menuId: string,
		startitem: number,
		depth: number
	): Promise<MenuItemsResponse> {
		return api
			.get(`${siteId}/menus/${menuId}/subset`, {
				searchParams: {
					startitem,
					depth,
					pagesize: -1,
				},
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

	public async upsertContentMenuItems(
		siteId: string,
		items: PendingMenuItems
	): Promise<MenuItem[]> {
		return api
			.post(`${siteId}/items`, {
				json: {
					...items,
				},
			})
			.json();
	}

	public async rearrangeMenuItems(
		siteId: string,
		menuId: string,
		rearrangeItems: RearrangeNavItem[]
	): Promise<Response> {
		return api.post(`${siteId}/menus/${menuId}/items/rearrange`, {
			json: rearrangeItems,
		});
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
