import { alertService, BaseEntityFacade } from '@redactie/utils';

import { Menu, MenusApiService, menusApiService } from '../../services/menus';

import { getAlertMessages } from './menus.messages';
import { MenusQuery, menusQuery } from './menus.query';
import { menusStore, MenusStore } from './menus.store';

export class MenusFacade extends BaseEntityFacade<MenusStore, MenusApiService, MenusQuery> {
	public readonly meta$ = this.query.meta$;
	public readonly menus$ = this.query.menus$;
	public readonly menu$ = this.query.menu$;
	public readonly menuDraft$ = this.query.menuDraft$;

	public getMenus(siteId: string): void {
		const { isFetching } = this.query.getValue();

		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getMenus(siteId)
			.then(response => {
				if (!response) {
					throw new Error('Getting menus failed!');
				}

				this.store.set(response._embedded.resourceList);
				this.store.update({
					meta: response._page,
					isFetching: false,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public getMenu(siteId: string, uuid: string): void {
		const { isFetchingOne, contentType } = this.query.getValue();
		if (isFetchingOne || contentType?.uuid === uuid) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getMenu(siteId, uuid)
			.then(response => {
				if (!response) {
					throw new Error(`Getting menu '${uuid}' failed!`);
				}

				this.store.update({
					menu: response,
					isFetchingOne: false,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}

	public createMenu(siteId: string, body: Menu, alertId: string): void {
		const { isCreating } = this.query.getValue();

		if (isCreating) {
			return;
		}

		this.store.setIsCreating(true);

		this.service
			.createMenu(siteId, body)
			.then(response => {
				if (!response) {
					throw new Error(`Creating menu '${body?.label}' failed!`);
				}

				this.store.update({
					menu: response,
					menuDraft: response,
					isCreating: false,
				});
				alertService.success(getAlertMessages(response).create.success, {
					containerId: alertId,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isCreating: false,
				});
				alertService.danger(getAlertMessages(body).create.error, {
					containerId: alertId,
				});
			});
	}

	public setMenu(menu: Menu): void {
		this.store.update({
			menu,
		});
	}

	public setMenuDraft(menuDraft: Menu): void {
		this.store.update({
			menuDraft,
		});
	}

	public unsetMenuDraft(): void {
		this.store.update({
			menuDraft: undefined,
		});
	}

	public unsetMenu(): void {
		this.store.update({
			menu: undefined,
		});
	}
}

export const menusFacade = new MenusFacade(menusStore, menusApiService, menusQuery);
