import { sitestructureBreadcrumbsFacade } from '../store/siteStructureBreadcrumbs/sitestructureBreadcrumbs.facade';

import { NavigationAPI } from './api.types';

export const store: NavigationAPI['store'] = {
	sitestructureBreadcrumbsFacade,
};
