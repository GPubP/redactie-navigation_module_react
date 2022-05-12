import { BaseMultiEntityState } from '@redactie/utils';

import { NavItem } from '../../navigation.types';

export type SitestructureBreadcrumbsModel = NavItem;
export type SitestructureBreadcrumbsState = BaseMultiEntityState<
	SitestructureBreadcrumbsModel,
	string
>;
