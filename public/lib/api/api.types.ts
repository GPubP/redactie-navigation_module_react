import { SitestructureBreadcrumbsFacade } from '../store/siteStructureBreadcrumbs/sitestructureBreadcrumbs.facade';

export interface NavigationAPI {
	store: {
		sitestructureBreadcrumbsFacade: SitestructureBreadcrumbsFacade;
	};
}
