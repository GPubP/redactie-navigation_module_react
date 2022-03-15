import { Breadcrumb, BreadcrumbOptions } from '@redactie/redactie-core';
import { ContextHeaderTab, NavigateGenerateFn } from '@redactie/utils';

export const TENANT_ROOT = '/:tenantId';
export const SITES_ROOT = 'sites';
export const SITE_ROOT = `/:siteId`;
const MENUS_BASE_PATH = '/menus';
const MENUS_DETAIL_BASE_PATH = '/menus/:menuId';
const CONTENT_TYPE_DETAIL_BASE_PATH = `/content-types/:contentTypeUuid`;

export const MODULE_PATHS = {
	admin: `/content/overzicht`,

	root: MENUS_BASE_PATH,
	overview: `${MENUS_BASE_PATH}/overzicht`,

	create: `${MENUS_BASE_PATH}/aanmaken`,

	tenantContentTypeDetailExternal: `${CONTENT_TYPE_DETAIL_BASE_PATH}/:tab`,
	tenantContentTypeDetailExternalChild: `${CONTENT_TYPE_DETAIL_BASE_PATH}/:tab/:child`,
	tenantContentTypeDetailExternalUrl: `${TENANT_ROOT}${CONTENT_TYPE_DETAIL_BASE_PATH}/:tab/url`,

	// SITE
	site: {
		contentTypes: `${SITE_ROOT}/:ctType(content-types|content-blokken)`,
		explicitContentTypes: `${SITE_ROOT}/content-types`,
		admin: `${SITE_ROOT}/content/overzicht`,
		dashboard: `${SITE_ROOT}/content`,
		root: `${SITE_ROOT}/menus`,
		overview: `${SITE_ROOT}/menus/overzicht`,
		create: `${SITE_ROOT}/menus/aanmaken`,
		createSettings: `${SITE_ROOT}/menus/aanmaken/instellingen`,
		detail: `${SITE_ROOT}/menus/:menuId`,
		detailSettings: `${SITE_ROOT}/menus/:menuId/instellingen`,
		contentTypeMenu: `${SITE_ROOT}/content-types/:contentTypeId`,
		menuItems: `${SITE_ROOT}/menus/:menuId/menu-items`,
		createContentRefMenuItem: `${SITE_ROOT}/menus/:menuId/menu-items/content-referentie/aanmaken`,
		createContentRefMenuItemSettings: `${SITE_ROOT}/menus/:menuId/menu-items/content-referentie/aanmaken/instellingen`,
		contentRefMenuItemDetail: `${SITE_ROOT}/menus/:menuId/menu-items/content-referentie/:menuItemId`,
		contentRefMenuItemDetailSettings: `${SITE_ROOT}/menus/:menuId/menu-items/content-referentie/:menuItemId/instellingen`,
		contentTypeDetailExternal: `${SITE_ROOT}${CONTENT_TYPE_DETAIL_BASE_PATH}/:tab`,
		contentTypeDetailExternalChild: `${SITE_ROOT}${CONTENT_TYPE_DETAIL_BASE_PATH}/:tab/:child`,
		contentTypeDetailExternalUrl: `${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}${CONTENT_TYPE_DETAIL_BASE_PATH}/:tab/url`,
		contentTypeDetailExternalMenu: `${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}${CONTENT_TYPE_DETAIL_BASE_PATH}/:tab/menu`,
	},
};

export const BREADCRUMB_OPTIONS = (
	generatePath: NavigateGenerateFn,
	extraBreadcrumbs: Breadcrumb[] = []
): BreadcrumbOptions => ({
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}${MENUS_BASE_PATH}`,
		`${TENANT_ROOT}/sites`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${MENUS_DETAIL_BASE_PATH}/menu-items`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${MENUS_DETAIL_BASE_PATH}/menu-items/content-referentie`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${MENUS_DETAIL_BASE_PATH}/menu-items/content-referentie`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${CONTENT_TYPE_DETAIL_BASE_PATH}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})/:tab/:child`,
	],
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
	menuItemsOverview: 'menu-items-overview',
};
