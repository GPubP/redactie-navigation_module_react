import { alertService, BaseEntityFacade, LoadingState } from '@redactie/utils';

import { ALERT_CONTAINER_IDS } from '../../navigation.const';
import { Menu, MenusApiService, menusApiService, MenusResponse } from '../../services/menus';

import { getAlertMessages } from './menus.messages';
import { MenusQuery, menusQuery } from './menus.query';
import { menusStore, MenusStore } from './menus.store';

export class MenusFacade extends BaseEntityFacade<MenusStore, MenusApiService, MenusQuery> {
	public readonly meta$ = this.query.meta$;
	public readonly menus$ = this.query.menus$;
	public readonly menu$ = this.query.menu$;
	public readonly menuDraft$ = this.query.menuDraft$;
	public readonly occurrences$ = this.query.occurrences$;
	public readonly isFetchingOccurrences$ = this.query.isFetchingOccurrences$;

	public getMenus(siteId: string, siteName: string): void {
		const { isFetching } = this.query.getValue();

		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getMenus(siteId, siteName)
			.then((response: MenusResponse | null) => {
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
		const { isFetchingOne } = this.query.getValue();
		if (isFetchingOne) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getMenu(siteId, uuid)
			.then((response: Menu | null) => {
				if (!response) {
					throw new Error(`Getting menu '${uuid}' failed!`);
				}

				this.store.update({
					menu: {
						...response,
						lang: 'nl',
					},
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
			.then((response: Menu | null) => {
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

	public updateMenu(siteId: string, body: Menu, alertId: string): Promise<void> {
		const { isUpdating } = this.query.getValue();

		if (isUpdating) {
			return Promise.resolve();
		}

		this.store.setIsUpdating(true);

		return this.service
			.updateMenu(siteId, body)
			.then((response: Menu | null) => {
				if (!response) {
					throw new Error(`Updating menu '${body.id}' failed!`);
				}

				this.store.update({
					menu: {
						...response,
						lang: 'nl',
					},
					menuDraft: {
						...response,
						lang: 'nl',
					},
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
	}

	public getOccurrences(siteId: string, uuid: string): void {
		const { isFetchingOccurrences } = this.query.getValue();

		if (isFetchingOccurrences === LoadingState.Loading) {
			return;
		}

		this.store.update({
			isFetchingOccurrences: LoadingState.Loading,
		});

		this.service
			.getOccurrences(siteId, uuid)
			.then(response => {
				if (!response) {
					throw new Error(`Getting occurrences failed!`);
				}

				this.store.update({
					occurrences: response._embedded.contentTypes,
					isFetchingOccurrences: LoadingState.Loaded,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOccurrences: LoadingState.Error,
				});
			});
	}

	public async deleteMenu(siteId: string, body: Menu): Promise<void> {
		const { isRemoving } = this.query.getValue();

		if (isRemoving || !body) {
			return Promise.resolve();
		}

		this.store.setIsRemoving(true);

		return this.service
			.deleteMenu(siteId, body)
			.then(() => {
				this.store.update({
					menu: undefined,
					menuDraft: undefined,
					occurrences: undefined,
					menuItems: undefined,
					menuItemsCount: undefined,
					isRemoving: false,
				});

				// Timeout because the alert should be visible on the overview page
				setTimeout(() => {
					alertService.success(getAlertMessages(body).delete.success, {
						containerId: ALERT_CONTAINER_IDS.overview,
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
