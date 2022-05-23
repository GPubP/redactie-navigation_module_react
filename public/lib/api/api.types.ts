import { NavItem } from '../navigation.types';
import { SitestructureBreadcrumbsFacade } from '../store/siteStructureBreadcrumbs/sitestructureBreadcrumbs.facade';

export interface NavigationStoreAPI {
	sitestructureBreadcrumbsFacade: SitestructureBreadcrumbsFacade;
}

export interface NavigationAPI {
	store: NavigationStoreAPI;
}

export { NavItem };
