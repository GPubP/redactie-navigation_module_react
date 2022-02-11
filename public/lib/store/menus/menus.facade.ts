import { BaseEntityFacade } from '@redactie/utils';

import {
	menusApiService,
	MenusApiService,
	MenuSchema
} from '../../services/menus';

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

				this.store.set(response._embedded);
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

	/* public updateMenu(siteId: string, body: MenuSchema, alertId: string): Promise<void> {
		const { isUpdating } = this.query.getValue();

		if (isUpdating) {
			return Promise.resolve();
		}

		this.store.setIsUpdating(true);

		return this.service
			.updateMenu(siteId, body)
			.then(response => {
				if (!response) {
					throw new Error(`Updating menu '${body.uuid}' failed!`);
				}

				this.store.update({
					menu: response,
					menuDraft: response,
					isUpdating: false,
				});

				alertService.success(getAlertMessages(response).update.success, {
					containerId: alertId,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
				});

				alertService.danger(getAlertMessages(body).update.error, {
					containerId: alertId,
				});
			});
	} */

	/* public createMenu(siteId: string, body: MenuSchema, alertId: string): void {
		const { isCreating } = this.query.getValue();

		if (isCreating) {
			return;
		}

		this.store.setIsCreating(true);

		this.service
			.createMenu(siteId, body)
			.then(response => {
				if (!response) {
					throw new Error(`Creating menu '${body?.meta?.label}' failed!`);
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
	} */

	/* public async deleteMenu(siteId: string, body: MenuSchema): Promise<void> {
		const { isRemoving } = this.query.getValue();

		if (isRemoving) {
			return Promise.resolve();
		}

		this.store.setIsRemoving(true);

		return this.service
			.deleteMenu(siteId, body.uuid as string)
			.then(() => {
				this.store.update({
					menu: undefined,
					menuDraft: undefined,
					isRemoving: false,
				});

				// Timeout because the alert should be visible on the overmenu page
				setTimeout(() => {
					alertService.success(getAlertMessages(body).delete.success, {
						containerId: ALERT_CONTAINER_IDS.overmenu,
					});
				}, 300);
			})
			.catch(error => {
				this.store.update({
					error,
					isRemoving: false,
				});

				alertService.danger(getAlertMessages(body).delete.error, {
					containerId: ALERT_CONTAINER_IDS.settings,
				});

				throw new Error('Deleting menu failed!');
			});
	} */

	public setMenu(menu: MenuSchema): void {
		this.store.update({
			menu,
		});
	}

	public setMenuDraft(menuDraft: MenuSchema): void {
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
