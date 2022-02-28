import { Breadcrumb, BreadcrumbOptions } from '@redactie/redactie-core';
import { ContextHeaderTab, NavigateGenerateFn } from '@redactie/utils';

export const TENANT_ROOT = '/:tenantId';
export const SITES_ROOT = 'sites';
export const urlSiteParam = `/:siteId`;
export const root = '/menus';

export const MODULE_PATHS = {
	admin: `/content/overzicht`,

	root,
	overview: `${root}/overzicht`,

	create: `${root}/aanmaken`,

	// SITE
	site: {
		contentTypes: `${urlSiteParam}/:ctType(content-types|content-blokken)`,
		explicitContentTypes: `${urlSiteParam}/content-types`,
		admin: `${urlSiteParam}/content/overzicht`,
		dashboard: `${urlSiteParam}/content`,
		root: `${urlSiteParam}/menus`,
		overview: `${urlSiteParam}/menus/overzicht`,
		create: `${urlSiteParam}/menus/aanmaken`,
		createSettings: `${urlSiteParam}/menus/aanmaken/instellingen`,
		detail: `${urlSiteParam}/menus/:menuUuid`,
		detailSettings: `${urlSiteParam}/menus/:menuUuid/instellingen`,
		menuItems: `${urlSiteParam}/menus/:menuUuid/menu-items`,
		contentTypeMenu: `${urlSiteParam}/content-types/:contentTypeId`,
	},
};

export const BREADCRUMB_OPTIONS = (
	generatePath: NavigateGenerateFn,
	extraBreadcrumbs: Breadcrumb[] = []
): BreadcrumbOptions => ({
	excludePaths: ['/', `${TENANT_ROOT}`, `${TENANT_ROOT}${root}`, `${TENANT_ROOT}/sites`],
	extraBreadcrumbs: [
		{
			name: 'Home',
			target: generatePath(MODULE_PATHS.admin),
		},
		{
			name: 'Structuur',
			target: '',
		},
		...extraBreadcrumbs,
	],
});

export const MENU_DETAIL_TAB_MAP: {
	[key in 'settings' | 'menuItems']: ContextHeaderTab;
} = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
		disabled: false,
	},
	menuItems: {
		name: 'Menu-items',
		target: 'menu-items',
		active: false,
		disabled: false,
	},
};

export const MENU_DETAIL_TABS: ContextHeaderTab[] = [
	MENU_DETAIL_TAB_MAP.settings,
	MENU_DETAIL_TAB_MAP.menuItems,
];

export const CONFIG: Readonly<{ name: string; module: string }> = {
	name: 'navigation',
	module: 'navigation-module',
};

export const ALERT_CONTAINER_IDS = {
	settings: 'settings',
	overview: 'overview',
};
