import { alertService, BaseEntityFacade, SearchParams } from '@redactie/utils';

import { ALERT_CONTAINER_IDS } from '../../navigation.const';
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

export class SiteStructuresFacade extends BaseEntityFacade<
	SiteStructuresStore,
	SiteStructuresApiService,
	SiteStructuresQuery
> {
	public readonly meta$ = this.query.meta$;
	public readonly siteStructures$ = this.query.siteStructures$;
	public readonly siteStructure$ = this.query.siteStructure$;
	public readonly siteStructureDraft$ = this.query.siteStructureDraft$;

	public getSiteStructures(siteId: string, searchParams: SearchParams): void {
		const { isFetching } = this.query.getValue();

		if (isFetching) {
			return;
		}

		this.store.setIsFetching(true);

		this.service
			.getSiteStructures(siteId, searchParams)
			.then((response: SiteStructuresResponse) => {
				if (!response) {
					throw new Error('Getting siteStructures failed!');
				}

				this.store.set(
					response._embedded.resourceList.map(siteStructure => {
						const categoryArray = siteStructure.category.label.split('_');

						return {
							...siteStructure,
							lang: categoryArray[categoryArray.length - 1],
						};
					})
				);
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

	public getSiteStructure(siteId: string, uuid: string): void {
		const { isFetchingOne } = this.query.getValue();
		if (isFetchingOne) {
			return;
		}

		this.store.setIsFetchingOne(true);
		this.service
			.getSiteStructure(siteId, uuid)
			.then((response: SiteStructure) => {
				if (!response) {
					throw new Error(`Getting siteStructure '${uuid}' failed!`);
				}

				const categoryArray = response.category.label.split('_');

				this.store.update({
					siteStructure: {
						...response,
						lang: categoryArray[categoryArray.length - 1],
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

	public createSiteStructure(siteId: string, body: SiteStructure, alertId: string): void {
		const { isCreating } = this.query.getValue();

		if (isCreating) {
			return;
		}

		this.store.setIsCreating(true);

		this.service
			.createSiteStructure(siteId, body)
			.then((response: SiteStructure) => {
				if (!response) {
					throw new Error(`Creating siteStructure '${body?.label}' failed!`);
				}

				this.store.update({
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

	public async updateSiteStructure(
		siteId: string,
		body: UpdateSiteStructureDto,
		alertId: string
	): Promise<void> {
		const { isUpdating } = this.query.getValue();

		if (isUpdating) {
			return Promise.resolve();
		}

		this.store.setIsUpdating(true);

		return this.service
			.updateSiteStructure(siteId, body)
			.then((response: SiteStructure) => {
				if (!response) {
					throw new Error(`Updating siteStructure '${body.id}' failed!`);
				}

				const categoryArray = response.category.label.split('_');
				const siteStructure = {
					...response,
					lang: categoryArray[categoryArray.length - 1],
				};

				this.store.update({
					siteStructure,
					siteStructureDraft: siteStructure,
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

	public async deleteSiteStructure(siteId: string, body: SiteStructure): Promise<void> {
		const { isRemoving } = this.query.getValue();

		if (isRemoving || !body) {
			return Promise.resolve();
		}

		this.store.setIsRemoving(true);

		return this.service
			.deleteSiteStructure(siteId, body)
			.then(() => {
				this.store.update({
					siteStructure: undefined,
					siteStructureDraft: undefined,
					siteStructureItems: undefined,
					siteStructureItemsCount: undefined,
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

				throw new Error('Deleting siteStructure failed!');
			});
	}

	public setSiteStructure(siteStructure: SiteStructure): void {
		this.store.update({
			siteStructure,
		});
	}

	public setSiteStructureDraft(siteStructureDraft: SiteStructure): void {
		this.store.update({
			siteStructureDraft,
		});
	}

	public unsetSiteStructureDraft(): void {
		this.store.update({
			siteStructureDraft: undefined,
		});
	}

	public unsetSiteStructure(): void {
		this.store.update({
			siteStructure: undefined,
		});
	}
}

export const siteStructuresFacade = new SiteStructuresFacade(
	siteStructuresStore,
	siteStructuresApiService,
	siteStructuresQuery
);
