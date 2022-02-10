import { parseSearchParams } from '@redactie/utils';
import { ResponsePromise } from 'ky';

import { api } from '../api';

import {
	CreateMenuItemPayload,
	MenuDetail,
	MenuItem,
	MenusResponse,
	UpdateMenuItemPayload,
} from './menus.service.types';

export class MenusApiService {
	public getMenus(siteId: string, siteCategory: string, lang: string): Promise<MenusResponse> {
		return api
			.get(
				`${siteId}/menus?${parseSearchParams({
					siteCategory,
					lang,
				})}`
			)
			.json<MenusResponse>();
	}

	public getMenu(
		siteId: string,
		menuId: number,
		siteCategory: string,
		lang: string
	): Promise<MenuDetail> {
		return api
			.get(
				`${siteId}/menus/${menuId}?${parseSearchParams({
					siteCategory,
					lang,
				})}`
			)
			.json<MenuDetail>();
	}

	public async getMenuItem(
		siteId: string,
		menuId: number,
		menuItemId: number,
		siteCategory: string,
		lang: string
	): Promise<MenuItem> {
		const item = await api
			.get(
				`${siteId}/menus/${menuId}/items/${menuItemId}?${parseSearchParams({
					siteCategory,
					lang,
				})}`
			)
			.json<MenuItem>();

		if (!item?.id) {
			throw new Error('NotFound');
		}

		return item;
	}

	public createMenuItem(
		siteId: string,
		menuId: number,
		body: CreateMenuItemPayload,
		siteCategory: string,
		lang: string
	): Promise<MenuItem> {
		return api
			.post(
				`${siteId}/menus/${menuId}/items?${parseSearchParams({
					siteCategory,
					lang,
				})}`,
				{
					json: body,
				}
			)
			.json();
	}

	public updateMenuItem(
		siteId: string,
		menuId: number,
		itemId: number,
		body: UpdateMenuItemPayload,
		siteCategory: string,
		lang: string
	): Promise<MenuItem> {
		return api
			.put(
				`${siteId}/menus/${menuId}/items/${itemId}?${parseSearchParams({
					siteCategory,
					lang,
				})}`,
				{
					json: body,
				}
			)
			.json();
	}

	public deleteMenuItem(
		siteId: string,
		menuId: number,
		itemId: number,
		siteCategory: string,
		lang: string
	): ResponsePromise {
		return api.delete(
			`${siteId}/menus/${menuId}/items/${itemId}?${parseSearchParams({
				siteCategory,
				lang,
			})}`
		);
	}
}

export const menusApiService = new MenusApiService();
