import { BaseMultiEntityQuery } from '@redactie/utils';

import { SitestructureBreadcrumbsState } from './siteStructureBreadcrumbs.model';
import { sitestructureBreadcrumbsStore } from './siteStructureBreadcrumbs.store';

export class SitestructureBreadcrumbsQuery extends BaseMultiEntityQuery<
	SitestructureBreadcrumbsState
> {}

export const sitestructureBreadcrumbsQuery = new SitestructureBreadcrumbsQuery(
	sitestructureBreadcrumbsStore
);
