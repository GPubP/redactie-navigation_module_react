import { StoreConfig } from '@datorama/akita';
import { BaseMultiEntityStore } from '@redactie/utils';

import { SitestructureBreadcrumbsState } from './siteStructureBreadcrumbs.model';

@StoreConfig({ name: 'sitestructureBreadcrumbs', idKey: 'id' })
export class SitestructureBreadcrumbsStore extends BaseMultiEntityStore<
	SitestructureBreadcrumbsState
> {
	constructor(initialState: Partial<SitestructureBreadcrumbsState>) {
		super(initialState);
	}
}

export const sitestructureBreadcrumbsStore = new SitestructureBreadcrumbsStore({});
