import { alertService, BaseMultiEntityFacade, SearchParams } from '@redactie/utils';
import { pathOr } from 'ramda';

import { buildSubset } from '../../helpers';
import { rearrangeItems } from '../../helpers/rearrangeItems';
import { ALERT_CONTAINER_IDS } from '../../navigation.const';
import { NavItem, RearrangeNavItem } from '../../navigation.types';
import {
	SiteStructureItem,
	SiteStructureItemsApiService,
	siteStructureItemsApiService,
	SiteStructureItemsResponse,
} from '../../services/siteStructureItems';

import { getAlertMessages } from './siteStructureItems.messages';
import { siteStructureItemsQuery, SiteStructureItemsQuery } from './siteStructureItems.query';
import { siteStructureItemsStore, SiteStructureItemsStore } from './siteStructureItems.store';

export class SiteStructureItemsFacade extends BaseMultiEntityFacade<
	SiteStructureItemsStore,
	SiteStructureItemsApiService,
	SiteStructureItemsQuery
> {
	public readonly pendingSiteStructureItemSync = this.query.pendingSiteStructureItemSync;

	public getSiteStructureItems(
		siteId: string,
		siteStructureId: string,
		searchParams: SearchParams,
		reload = false,
		key = ''
	): void {
		if (!key) {
			key = siteStructureId;
		}

		const oldValue = this.query.getItem(key);
		const isFetching = this.query.getItemIsFetching(key);

		if ((!reload && oldValue) || isFetching) {
			return;
		}

		if (!oldValue) {
			this.store.addItem(key);
		}

		this.store.setItemIsFetching(key, true);

		this.service
			.getSiteStructureItems(siteId, siteStructureId, searchParams)
			.then((response: SiteStructureItemsResponse) => {
				if (!response) {
					throw new Error('Getting siteStructureItems failed!');
				}

				this.store.setItemValue(key, response?._embedded.resourceList);
				this.store.setItemIsFetching(key, false);
			})
			.catch(error => {
				this.store.setItemError(key, error);
				this.store.setItemIsFetching(key, false);
			});
	}

	public getContentTypeSiteStructureItems(
		siteId: string,
		contentTypeId: string,
		searchParams: SearchParams,
		reload = false,
		key = ''
	): void {
		if (!key) {
			key = contentTypeId;
		}

		const oldValue = this.query.getItem(key);
		const isFetching = this.query.getItemIsFetching(key);

		if ((!reload && oldValue) || isFetching) {
			return;
		}

		if (!oldValue) {
			this.store.addItem(key);
		}

		this.store.setItemIsFetching(key, true);

		this.service
			.getContentTypeSiteStructureItems(siteId, contentTypeId, searchParams)
			.then((response: SiteStructureItemsResponse) => {
				if (!response) {
					throw new Error('Getting contentTypeSiteStructureItems failed!');
				}

				this.store.setItemValue(key, response?._embedded.resourceList);
				this.store.setItemIsFetching(key, false);
			})
			.catch(error => {
				this.store.setItemError(key, error);
				this.store.setItemIsFetching(key, false);
			});
	}

	public getContentSiteStructurePrimaryItem(
		siteId: string,
		contentId: string,
		reload = false,
		key = ''
	): void {
		if (!key) {
			key = contentId;
		}

		const oldValue = this.query.getItem(key);
		const isFetching = this.query.getItemIsFetching(key);

		if ((!reload && oldValue) || isFetching) {
			return;
		}

		if (!oldValue) {
			this.store.addItem(key);
		}

		this.store.setItemIsFetching(key, true);

		this.service
			.getContentSiteStructurePrimaryItem(siteId, contentId)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error('Getting siteStructureItem failed!');
				}

				this.store.setItemValue(key, response);
				this.store.setItemIsFetching(key, false);
			})
			.catch(error => {
				this.store.setItemError(key, error);
				this.store.setItemIsFetching(key, false);
			});
	}

	public async getSubset(
		siteId: string,
		siteStructureId: string,
		startitem = 0,
		depth = 0,
		reload = false,
		key = ''
	): Promise<void> {
		if (!key) {
			key = siteStructureId;
		}

		const oldValue = this.query.getItem(key);
		const isFetching = this.query.getItemIsFetching(key);

		if ((!reload && oldValue) || isFetching) {
			return;
		}

		if (!oldValue) {
			this.store.addItem(key);
		}

		this.store.setItemIsFetching(key, true);

		return this.service
			.getSubset(siteId, siteStructureId, startitem, depth)
			.then(async (response: SiteStructureItemsResponse) => {
				if (!response) {
					throw new Error('Getting siteStructureItems subset failed!');
				}

				this.store.setItemValue(
					key,
					buildSubset(
						(oldValue?.value as NavItem[]) || [],
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

				this.store.setItemIsFetching(key, false);
			})
			.catch(error => {
				this.store.setItemError(key, error);
				this.store.setItemIsFetching(key, false);
			});
	}

	public getSiteStructureItem(
		siteId: string,
		siteStructureId: string,
		siteStructureItemId: string,
		reload = false,
		key = ''
	): void {
		if (!key) {
			key = siteStructureItemId;
		}

		const oldValue = this.query.getItem(key);
		const isFetching = this.query.getItemIsFetching(key);

		if ((!reload && oldValue) || isFetching) {
			return;
		}

		if (!oldValue) {
			this.store.addItem(key);
		}

		this.store.setItemIsFetching(key, true);

		this.service
			.getSiteStructureItem(siteId, siteStructureId, siteStructureItemId)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error(`Getting siteStructureItem '${siteStructureItemId}' failed!`);
				}

				this.store.setItemValue(key, response);
				this.store.setItemIsFetching(key, false);
			})
			.catch(error => {
				this.store.setItemError(key, error);
				this.store.setItemIsFetching(key, false);
			});
	}

	public async createSiteStructureItem(
		siteId: string,
		siteStructureId: string,
		body: SiteStructureItem,
		alertId: string,
		key = ''
	): Promise<SiteStructureItem | undefined> {
		const isCreating = this.query.getItemIsCreating(key);

		if (isCreating) {
			return;
		}

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemIsCreating(key, true);

		return this.service
			.createSiteStructureItem(siteId, siteStructureId, body)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error(`Creating siteStructureItem '${body?.label}' failed!`);
				}

				this.store.setItemValue(key, response);
				this.store.setItemIsCreating(key, false);

				// Timeout because the alert should be visible on the overview page
				setTimeout(() => {
					alertService.success(getAlertMessages(response).create.success, {
						containerId: alertId,
					});
				}, 300);

				return response;
			})
			.catch(error => {
				this.store.setItemIsCreating(key, false);
				this.store.setItemError(key, error);

				alertService.danger(getAlertMessages(body).create.error, {
					containerId: alertId,
				});

				return undefined;
			});
	}

	public async updateSiteStructureItem(
		siteId: string,
		menuId: string,
		body: SiteStructureItem,
		alertId: string,
		key = ''
	): Promise<void> {
		if (!key) {
			key = `${body.id}`;
		}

		const isUpdating = this.query.getItemIsUpdating(key);

		if (isUpdating) {
			return Promise.resolve();
		}

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemIsUpdating(key, true);

		return this.service
			.updateSiteStructureItem(siteId, menuId, body)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error(`Updating siteStructureItem '${body.id}' failed!`);
				}

				this.store.setItemValue(key, response);
				this.store.setItemIsUpdating(key, false);

				alertService.success(getAlertMessages(response).update.success, {
					containerId: alertId,
				});
			})
			.catch(error => {
				this.store.setItemIsUpdating(key, false);
				this.store.setItemError(key, error);

				alertService.danger(getAlertMessages(body).update.error, {
					containerId: alertId,
				});
			});
	}

	public async rearrangeItems(
		siteId: string,
		siteStructureId: string,
		body: RearrangeNavItem[],
		alertId: string,
		key = ''
	): Promise<void> {
		if (!key) {
			key = siteStructureId;
		}

		const isUpdating = this.query.getItemIsUpdating(key);

		if (isUpdating) {
			return Promise.resolve();
		}

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemIsUpdating(key, true);

		return this.service
			.rearrangeSiteStructureItems(siteId, siteStructureId, body)
			.then(async () => {
				const siteStructureItems = this.query.getItemValue(key) as NavItem[];

				this.store.setItemValue(key, rearrangeItems(siteStructureItems, body));
				this.store.setItemIsUpdating(key, false);

				alertService.success(getAlertMessages().rearrange.success, {
					containerId: alertId,
				});
			})
			.catch(error => {
				this.store.setItemIsUpdating(key, false);
				this.store.setItemError(key, error);

				alertService.danger(getAlertMessages().rearrange.error, {
					containerId: alertId,
				});
			});
	}

	public async deleteSiteStructureItem(
		siteId: string,
		siteStructureId: string,
		body: SiteStructureItem,
		alertId: string,
		key = ''
	): Promise<void> {
		if (!key) {
			key = `${body.id}`;
		}

		const isRemoving = this.query.getItemIsRemoving(key);

		if (isRemoving || !body) {
			return Promise.resolve();
		}

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemIsRemoving(key, true);

		return this.service
			.deleteSiteStructureItem(siteId, siteStructureId, body)
			.then(() => {
				this.store.setItemValue(key, undefined);
				this.store.setItemValue(`${key}.draft`, undefined);
				this.store.setItemIsRemoving(key, false);

				// Timeout because the alert should be visible on the overview page
				setTimeout(() => {
					alertService.success(getAlertMessages(body).delete.success, {
						containerId: alertId,
					});
				}, 300);
			})
			.catch(error => {
				this.store.setItemIsRemoving(key, false);
				this.store.setItemError(key, error);

				alertService.danger(getAlertMessages(body).delete.error, {
					containerId: ALERT_CONTAINER_IDS.settings,
				});

				throw new Error('Deleting siteStructureItem failed!');
			});
	}

	public setSiteStructureItem(siteStructureItem: SiteStructureItem, key = ''): void {
		if (!key) {
			key = `${siteStructureItem.id}`;
		}

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemValue(key, siteStructureItem);
	}

	public setSiteStructureItemDraft(siteStructureItemDraft: SiteStructureItem, key = ''): void {
		key =
			key && key.includes('.draft')
				? key
				: key
				? `${key}.draft`
				: `${siteStructureItemDraft.id}.draft`;

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemValue(key, siteStructureItemDraft);
	}

	public setPendingSiteStructureItem(
		pendingSiteStructureItem: NavItem | undefined,
		key = ''
	): void {
		key =
			key && key.includes('.pending')
				? key
				: key
				? `${key}.pending`
				: `${pendingSiteStructureItem?.id}.pending`;

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemValue(key, pendingSiteStructureItem);
	}

	public unsetSiteStructureItemDraft(key: string): void {
		this.store.setItemValue(key, undefined);
	}

	public unsetSiteStructureItem(key: string): void {
		this.store.setItemValue(key, undefined);
	}

	public unsetPendingSiteStructureItem(key: string): void {
		this.store.setItemValue(key, undefined);
	}
}

export const siteStructureItemsFacade = new SiteStructureItemsFacade(
	siteStructureItemsStore,
	siteStructureItemsApiService,
	siteStructureItemsQuery
);
