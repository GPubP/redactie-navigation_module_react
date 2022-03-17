import { MODULE_PATHS, SITES_ROOT, TENANT_ROOT } from '../../navigation.const';

export const NAV_SITE_COMPARTMENTS = [
	{ label: 'URL', to: 'url' },
	{ label: 'Menu', to: 'menu' },
];

export const SITE_DETAIL_TAB_ALLOWED_PATHS = [
	`${TENANT_ROOT}/${SITES_ROOT}${MODULE_PATHS.site.contentTypeDetailExternalChild}`,
];
