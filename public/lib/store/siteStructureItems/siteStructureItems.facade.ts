import { alertService, BaseEntityFacade, SearchParams } from '@redactie/utils';
import { pathOr } from 'ramda';
import { take } from 'rxjs/operators';

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

export class SiteStructureItemsFacade extends BaseEntityFacade<
	SiteStructureItemsStore,
	SiteStructureItemsApiService,
	SiteStructureItemsQuery
> {
	public readonly siteStructureItems$ = this.query.siteStructureItems$;
	public readonly siteStructureItem$ = this.query.siteStructureItem$;
	public readonly siteStructureItemDraft$ = this.query.siteStructureItemDraft$;
	public readonly pendingSiteStructureItem$ = this.query.pendingSiteStructureItem$;
	public readonly contentTypeSiteStructureItems$ = this.query.contentTypeSiteStructureItems$;

	public getSiteStructureItems(siteId: string, menuId: string, searchParams: SearchParams): void {
		const { isFetching } = this.query.getValue();

		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getSiteStructureItems(siteId, menuId, searchParams)
			.then((response: SiteStructureItemsResponse) => {
				if (!response) {
					throw new Error('Getting siteStructureItems failed!');
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

	public getContentTypeSiteStructureItems(
		siteId: string,
		contentId: string,
		searchParams: SearchParams
	): void {
		const { isFetchingContentTypeSiteStructureItems } = this.query.getValue();

		if (isFetchingContentTypeSiteStructureItems) {
			return;
		}

		this.store.update({
			isFetchingContentTypeSiteStructureItems: true,
		});

		this.service
			.getContentTypeSiteStructureItems(siteId, contentId, searchParams)
			.then((response: SiteStructureItemsResponse) => {
				if (!response) {
					throw new Error('Getting contentTypeSiteStructureItems failed!');
				}

				this.store.update({
					contentTypeSiteStructureItems: response?._embedded.resourceList,
					isFetchingContentTypeSiteStructureItems: false,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingContentTypeSiteStructureItems: false,
				});
			});
	}

	public getContentSiteStructurePrimaryItem(siteId: string, contentId: string): void {
		const { isFetchingOne } = this.query.getValue();

		if (isFetchingOne) {
			return;
		}

		this.store.setIsFetchingOne(true);

		this.service
			.getContentSiteStructurePrimaryItem(siteId, contentId)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error('Getting siteStructureItem failed!');
				}

				this.store.update({
					siteStructureItem: response,
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
			.then(async (response: SiteStructureItemsResponse) => {
				if (!response) {
					throw new Error('Getting siteStructureItems subset failed!');
				}

				const result = await this.siteStructureItems$.pipe(take(1)).toPromise();

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

	public getSiteStructureItem(siteId: string, menuId: string, uuid: string): void {
		const { isFetchingOne } = this.query.getValue();
		if (isFetchingOne) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getSiteStructureItem(siteId, menuId, uuid)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error(`Getting siteStructureItem '${uuid}' failed!`);
				}

				this.store.update({
					siteStructureItem: response,
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

	public async createSiteStructureItem(
		siteId: string,
		menuId: string,
		body: SiteStructureItem,
		alertId: string
	): Promise<SiteStructureItem | undefined> {
		const { isCreating } = this.query.getValue();

		if (isCreating) {
			return;
		}

		this.store.setIsCreating(true);

		return this.service
			.createSiteStructureItem(siteId, menuId, body)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error(`Creating siteStructureItem '${body?.label}' failed!`);
				}

				this.store.update({
					siteStructureItem: response,
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

	public async updateSiteStructureItem(
		siteId: string,
		menuId: string,
		body: SiteStructureItem,
		alertId: string
	): Promise<void> {
		const { isUpdating } = this.query.getValue();

		if (isUpdating) {
			return Promise.resolve();
		}

		this.store.setIsUpdating(true);

		return this.service
			.updateSiteStructureItem(siteId, menuId, body)
			.then((response: SiteStructureItem) => {
				if (!response) {
					throw new Error(`Updating siteStructureItem '${body.id}' failed!`);
				}

				this.store.update({
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

	public async rearrangeItems(
		siteId: string,
		menuId: string,
		body: RearrangeNavItem[],
		alertId: string
	): Promise<void> {
		const { isUpdating } = this.query.getValue();

		if (isUpdating) {
			return Promise.resolve();
		}

		this.store.setIsUpdating(true);

		return this.service
			.rearrangeSiteStructureItems(siteId, menuId, body)
			.then(async () => {
				const siteStructureItems = await this.siteStructureItems$.pipe(take(1)).toPromise();

				this.store.set(rearrangeItems(siteStructureItems, body));
				this.store.update({
					isUpdating: false,
				});

				alertService.success(getAlertMessages().rearrange.success, {
					containerId: alertId,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
				});

				alertService.danger(getAlertMessages().rearrange.error, {
					containerId: alertId,
				});
			});
	}

	public async deleteSiteStructureItem(
		siteId: string,
		menuId: string,
		body: SiteStructureItem,
		alertId: string
	): Promise<void> {
		const { isRemoving } = this.query.getValue();

		if (isRemoving || !body) {
			return Promise.resolve();
		}

		this.store.setIsRemoving(true);

		return this.service
			.deleteSiteStructureItem(siteId, menuId, body)
			.then(() => {
				this.store.update({
					siteStructureItem: undefined,
					siteStructureItemDraft: undefined,
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

				throw new Error('Deleting siteStructureItem failed!');
			});
	}

	public setSiteStructureItem(siteStructureItem: SiteStructureItem): void {
		this.store.update({
			siteStructureItem,
		});
	}

	public setSiteStructureItemDraft(siteStructureItemDraft: SiteStructureItem): void {
		this.store.update({
			siteStructureItemDraft,
		});
	}

	public setPendingSiteStructureItem(pendingSiteStructureItem: NavItem): void {
		this.store.update({
			pendingSiteStructureItem,
		});
	}

	public unsetSiteStructureItemDraft(): void {
		this.store.update({
			siteStructureItemDraft: undefined,
		});
	}

	public unsetSiteStructureItem(): void {
		this.store.update({
			siteStructureItem: undefined,
		});
	}

	public unsetPendingSiteStructureItem(): void {
		this.store.update({
			pendingSiteStructureItem: undefined,
		});
	}
}

export const siteStructureItemsFacade = new SiteStructureItemsFacade(
	siteStructureItemsStore,
	siteStructureItemsApiService,
	siteStructureItemsQuery
);
