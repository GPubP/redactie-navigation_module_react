import { BaseMultiEntityFacade } from '@redactie/utils';

import { sitestructureBreadcrumbsApiService } from '../../services/SiteStructureBreadcrumbs';
import { SitestructureBreadcrumbsApiService } from '../../services/SiteStructureBreadcrumbs/SiteStructureBreadcrumbs.service';

import {
	sitestructureBreadcrumbsStore,
	SitestructureBreadcrumbsStore,
} from './siteStructureBreadcrumbs.store';
import {
	sitestructureBreadcrumbsQuery,
	SitestructureBreadcrumbsQuery,
} from './sitestructureBreadcrumbs.query';

export class SitestructureBreadcrumbsFacade extends BaseMultiEntityFacade<
	SitestructureBreadcrumbsStore,
	SitestructureBreadcrumbsApiService,
	SitestructureBreadcrumbsQuery
> {
	public async getBreadcrumbs(
		siteId: string,
		contentItemId: string,
		reload = false
	): Promise<void> {
		// Check if there is already a greeting
		const oldBreadcrumbs = this.query.getItem(contentItemId);
		const oldBreadcrumbsValue = this.query.getItemValue(contentItemId);

		// Do nothing when greeting is already present and reload is set to false
		if ((!reload && oldBreadcrumbsValue) || (!reload && oldBreadcrumbs?.error)) {
			return;
		}

		// Create new item in the store if there is none
		if (!oldBreadcrumbs) {
			this.store.addItem(contentItemId);
		}

		this.store.setItemIsFetching(contentItemId, true);

		return this.service
			.getBreadcrumbsOfContentItem(siteId, contentItemId)
			.then(sitestructureBreadcrumbsResponse => {
				const item = sitestructureBreadcrumbsResponse?._embedded?.resourceList[0];

				this.store.setItemValue(contentItemId, item);
			})
			.catch(error => {
				this.store.setItemError(contentItemId, error);
			})
			.finally(() => this.store.setItemIsFetching(contentItemId, false));
	}
}

export const sitestructureBreadcrumbsFacade = new SitestructureBreadcrumbsFacade(
	sitestructureBreadcrumbsStore,
	sitestructureBreadcrumbsApiService,
	sitestructureBreadcrumbsQuery
);
