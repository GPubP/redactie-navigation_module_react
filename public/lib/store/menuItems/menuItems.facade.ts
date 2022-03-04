import { alertService, BaseEntityFacade, SearchParams } from '@redactie/utils';
import { pathOr } from 'ramda';
import { take } from 'rxjs/operators';

import { buildSubset } from '../../helpers';
import { ALERT_CONTAINER_IDS } from '../../navigation.const';
import {
	MenuItem,
	menuItemsApiService,
	MenuItemsApiService,
	MenuItemsResponse,
} from '../../services/menuItems';

import { getAlertMessages } from './menuItems.messages';
import { menuItemsQuery, MenuItemsQuery } from './menuItems.query';
import { menuItemsStore, MenuItemsStore } from './menuItems.store';

export class MenuItemsFacade extends BaseEntityFacade<
	MenuItemsStore,
	MenuItemsApiService,
	MenuItemsQuery
> {
	public readonly menuItems$ = this.query.menuItems$;
	public readonly menuItem$ = this.query.menuItem$;
	public readonly menuItemDraft$ = this.query.menuItemDraft$;

	public getMenuItems(siteId: string, menuId: string, searchParams: SearchParams): void {
		const { isFetching } = this.query.getValue();

		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getMenuItems(siteId, menuId, searchParams)
			.then((response: MenuItemsResponse) => {
				if (!response) {
					throw new Error('Getting menuItems failed!');
				}

				this.store.set(response?._embedded.resourceList);
				this.store.update({
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

	public async getSubset(
		siteId: string,
		menuId: string,
		startitem = 0,
		depth = 0
	): Promise<void> {
		const { isFetching } = this.query.getValue();

		if (isFetching) {
			return Promise.resolve();
		}

		this.store.setIsFetching(true);

		return this.service
			.getSubset(siteId, menuId, startitem, depth)
			.then(async (response: MenuItemsResponse) => {
				if (!response) {
					throw new Error('Getting menuItems subset failed!');
				}

				const result = await this.menuItems$.pipe(take(1)).toPromise();

				this.store.set(
					buildSubset(
						result,
						startitem === 0
							? response?._embedded.resourceList
							: response?._embedded.resourceList[0].items,
						pathOr(
							0,
							['_embedded', 'resourceList', 0, 'items', 0, 'parentId'],
							response
						)
					)
				);

				this.store.update({
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

	public getMenuItem(siteId: string, menuId: string, uuid: string): void {
		const { isFetchingOne } = this.query.getValue();
		if (isFetchingOne) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getMenuItem(siteId, menuId, uuid)
			.then((response: MenuItem) => {
				if (!response) {
					throw new Error(`Getting menuItem '${uuid}' failed!`);
				}

				this.store.update({
					menuItem: response,
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

	public async createMenuItem(
		siteId: string,
		menuId: string,
		body: MenuItem,
		alertId: string
	): Promise<MenuItem | undefined> {
		const { isCreating } = this.query.getValue();

		if (isCreating) {
			return;
		}

		this.store.setIsCreating(true);

		return this.service
			.createMenuItem(siteId, menuId, body)
			.then((response: MenuItem) => {
				if (!response) {
					throw new Error(`Creating menuItem '${body?.label}' failed!`);
				}

				this.store.update({
					menuItem: response,
					menuItemDraft: response,
					isCreating: false,
				});

				// Timeout because the alert should be visible on the overview page
				setTimeout(() => {
					alertService.success(getAlertMessages(response).create.success, {
						containerId: alertId,
					});
				}, 300);

				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isCreating: false,
				});
				alertService.danger(getAlertMessages(body).create.error, {
					containerId: alertId,
				});
				return undefined;
			});
	}

	public async updateMenuItem(
		siteId: string,
		menuId: string,
		body: MenuItem,
		alertId: string
	): Promise<void> {
		const { isUpdating } = this.query.getValue();

		if (isUpdating) {
			return Promise.resolve();
		}

		this.store.setIsUpdating(true);

		return this.service
			.updateMenuItem(siteId, menuId, body)
			.then((response: MenuItem) => {
				if (!response) {
					throw new Error(`Updating menuItem '${body.id}' failed!`);
				}

				this.store.update({
					menuItem: response,
					menuItemDraft: response,
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

	public async deleteMenuItem(
		siteId: string,
		menuId: string,
		body: MenuItem,
		alertId: string
	): Promise<void> {
		const { isRemoving } = this.query.getValue();

		if (isRemoving || !body) {
			return Promise.resolve();
		}

		this.store.setIsRemoving(true);

		return this.service
			.deleteMenuItem(siteId, menuId, body)
			.then(() => {
				this.store.update({
					menuItem: undefined,
					menuItemDraft: undefined,
					isRemoving: false,
				});

				// Timeout because the alert should be visible on the overview page
				setTimeout(() => {
					alertService.success(getAlertMessages(body).delete.success, {
						containerId: alertId,
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

				throw new Error('Deleting menuItem failed!');
			});
	}

	public setMenuItem(menuItem: MenuItem): void {
		this.store.update({
			menuItem,
		});
	}

	public setMenuItemDraft(menuItemDraft: MenuItem): void {
		this.store.update({
			menuItemDraft,
		});
	}

	public unsetMenuItemDraft(): void {
		this.store.update({
			menuItemDraft: undefined,
		});
	}

	public unsetMenuItem(): void {
		this.store.update({
			menuItem: undefined,
		});
	}
}

export const menuItemsFacade = new MenuItemsFacade(
	menuItemsStore,
	menuItemsApiService,
	menuItemsQuery
);
