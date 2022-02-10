import { BaseEntityFacade } from '@redactie/utils';
import { Observable } from 'rxjs';

import { menusApiService, MenusApiService } from '../../services/menus';

import { MenuModel } from './menus.model';
import { MenusQuery, menusQuery } from './menus.query';
import { MenusStore, menusStore } from './menus.store';

export class MenusFacade extends BaseEntityFacade<MenusStore, MenusApiService, MenusQuery> {
	public readonly menusList$ = this.query.menuList$;

	public selectMenu(menuId: number): Observable<MenuModel> {
		return this.query.selectMenu(menuId);
	}

	public hasMenu(menuId: number): boolean {
		return this.query.hasEntity(menuId);
	}

	public fetchMenusList(siteId: string, siteCategory: string, lang: string): void {
		const state = this.query.getValue();

		if (state.menuList && state.menuList.length > 0) {
			return;
		}
		this.store.setIsFetching(true);

		this.service
			.getMenus(siteId, siteCategory, lang)
			.then(response => {
				const resourceList = response?._embedded?.resourceList;
				if (resourceList) {
					this.store.update({
						menuList: resourceList,
						isFetching: false,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public fetchMenu(
		siteId: string,
		menuId: number,
		siteCategory: string,
		lang: string,
		forceUpdate = false
	): void {
		if (this.query.hasEntity(menuId) && !forceUpdate) {
			return;
		}

		this.store.setIsFetchingOne(true);

		this.service
			.getMenu(siteId, menuId, siteCategory, lang)
			.then(response => {
				if (response) {
					this.store.upsert(menuId, response);
					this.store.setIsFetchingOne(false);
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}
}

export const menusFacade = new MenusFacade(menusStore, menusApiService, menusQuery);
