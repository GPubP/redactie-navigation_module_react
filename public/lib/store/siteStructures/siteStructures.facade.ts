import { alertService, BaseMultiEntityFacade, SearchParams } from '@redactie/utils';

import { ALERT_CONTAINER_IDS } from '../../navigation.const';
import { NavTree } from '../../navigation.types';
import {
	SiteStructure,
	SiteStructuresApiService,
	siteStructuresApiService,
	SiteStructuresResponse,
	UpdateSiteStructureDto,
} from '../../services/siteStructures';

import { getAlertMessages } from './siteStructures.messages';
import { SiteStructuresQuery, siteStructuresQuery } from './siteStructures.query';
import { siteStructuresStore, SiteStructuresStore } from './siteStructures.store';

export class SiteStructuresFacade extends BaseMultiEntityFacade<
	SiteStructuresStore,
	SiteStructuresApiService,
	SiteStructuresQuery
> {
	public readonly meta$ = this.query.meta$;

	public async getSiteStructures(
		siteId: string,
		searchParams: SearchParams,
		reload = false,
		key = ''
	): Promise<void> {
		if (!key) {
			key = siteId;
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

		await this.service
			.getSiteStructures(siteId, searchParams)
			.then((response: SiteStructuresResponse) => {
				if (!response) {
					throw new Error('Getting siteStructures failed!');
				}

				this.store.setItemValue(
					key,
					response._embedded.resourceList.map(siteStructure => {
						const categoryArray = siteStructure.category.label.split('_');

						return {
							...siteStructure,
							category: siteStructure.category.label,
							lang: categoryArray[categoryArray.length - 1],
						};
					})
				);

				this.store.update({
					meta: response._page,
				});
				this.store.setItemIsFetching(key, false);
			})
			.catch(error => {
				this.store.setItemError(key, error);
				this.store.setItemIsFetching(key, false);
			});
	}

	public getSiteStructure(siteId: string, id: string, reload = false, key = ''): void {
		if (!key) {
			key = id;
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
			.getSiteStructure(siteId, id)
			.then((response: NavTree) => {
				if (!response) {
					throw new Error(`Getting siteStructure '${id}' failed!`);
				}

				const categoryArray = response.category.label.split('_');

				this.store.setItemValue(key, {
					...response,
					category: response.category.label,
					lang: categoryArray[categoryArray.length - 1],
				});
				this.store.setItemIsFetching(key, false);
			})
			.catch(error => {
				this.store.setItemError(key, error);
				this.store.setItemIsFetching(key, false);
			});
	}

	public createSiteStructure(
		siteId: string,
		body: SiteStructure,
		alertId: string,
		key = ''
	): void {
		const isCreating = this.query.getItemIsCreating(key);

		if (isCreating) {
			return;
		}

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemIsCreating(key, true);

		this.service
			.createSiteStructure(siteId, body)
			.then((response: SiteStructure) => {
				if (!response) {
					throw new Error(`Creating siteStructure '${body?.label}' failed!`);
				}

				this.store.setItemIsCreating(key, false);

				alertService.success(getAlertMessages(response).create.success, {
					containerId: alertId,
				});
			})
			.catch(error => {
				this.store.setItemIsCreating(key, false);
				this.store.setItemError(key, error);

				alertService.danger(getAlertMessages(body).create.error, {
					containerId: alertId,
				});
			});
	}

	public async updateSiteStructure(
		siteId: string,
		body: UpdateSiteStructureDto,
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
			.updateSiteStructure(siteId, body)
			.then((response: NavTree) => {
				if (!response) {
					throw new Error(`Updating siteStructure '${body.id}' failed!`);
				}

				const categoryArray = response.category.label.split('_');
				const siteStructure = {
					...response,
					category: response.category.label,
					lang: categoryArray[categoryArray.length - 1],
				};

				this.store.setItemValue(key, siteStructure);
				this.store.setItemValue(`${key}.draft`, siteStructure);

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

	public async deleteSiteStructure(siteId: string, body: SiteStructure, key = ''): Promise<void> {
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
			.deleteSiteStructure(siteId, body)
			.then(() => {
				this.store.setItemValue(key, undefined);
				this.store.setItemValue(`${key}.draft`, undefined);
				this.store.setItemIsRemoving(key, false);

				// Timeout because the alert should be visible on the overview page
				setTimeout(() => {
					alertService.success(getAlertMessages(body).delete.success, {
						containerId: ALERT_CONTAINER_IDS.overview,
					});
				}, 300);
			})
			.catch(error => {
				this.store.setItemIsRemoving(key, false);
				this.store.setItemError(key, error);

				alertService.danger(getAlertMessages(body).delete.error, {
					containerId: ALERT_CONTAINER_IDS.settings,
				});

				throw new Error('Deleting siteStructure failed!');
			});
	}

	public setSiteStructure(siteStructure: SiteStructure, key = ''): void {
		if (!key) {
			key = `${siteStructure.id}`;
		}

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemValue(key, siteStructure);
	}

	public setSiteStructureDraft(siteStructureDraft: SiteStructure, key = ''): void {
		key =
			key && key.includes('.draft')
				? key
				: key
				? `${key}.draft`
				: `${siteStructureDraft.id}.draft`;

		if (!this.query.getItem(key)) {
			this.store.addItem(key);
		}

		this.store.setItemValue(key, siteStructureDraft);
	}

	public unsetSiteStructureDraft(key: string): void {
		this.store.setItemValue(key, undefined);
	}

	public unsetSiteStructure(key: string): void {
		this.store.setItemValue(key, undefined);
	}
}

export const siteStructuresFacade = new SiteStructuresFacade(
	siteStructuresStore,
	siteStructuresApiService,
	siteStructuresQuery
);
