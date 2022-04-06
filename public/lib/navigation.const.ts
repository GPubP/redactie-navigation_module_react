import { Breadcrumb, BreadcrumbOptions } from '@redactie/redactie-core';
import { ContextHeaderTab, NavigateGenerateFn } from '@redactie/utils';

export const TENANT_ROOT = '/:tenantId';
export const SITES_ROOT = 'sites';
export const SITE_ROOT = `/:siteId`;
const MENUS_BASE_PATH = '/menus';
const MENUS_DETAIL_BASE_PATH = '/menus/:menuId';
const SITE_STRUCTURES_BASE_PATH = '/sitestructuren';
const SITE_STRUCTURES_DETAIL_BASE_PATH = '/sitestructuren/:siteStructureId';
const CONTENT_TYPE_DETAIL_BASE_PATH = `/content-types/:contentTypeUuid`;

export const MODULE_PATHS = {
	forbidden403: '/403',

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
		menuRoot: `${SITE_ROOT}/menus`,
		menusOverview: `${SITE_ROOT}/menus/overzicht`,
		createMenu: `${SITE_ROOT}/menus/aanmaken`,
		createMenuSettings: `${SITE_ROOT}/menus/aanmaken/instellingen`,
		menuDetail: `${SITE_ROOT}/menus/:menuId`,
		menuDetailSettings: `${SITE_ROOT}/menus/:menuId/instellingen`,
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
		siteStrucureRoot: `${SITE_ROOT}/sitestructuren`,
		siteStructuresOverview: `${SITE_ROOT}/sitestructuren/overzicht`,
		createSiteStructure: `${SITE_ROOT}/sitestructuren/aanmaken`,
		createSiteStructureSettings: `${SITE_ROOT}/sitestructuren/aanmaken/instellingen`,
		siteStructureDetail: `${SITE_ROOT}/sitestructuren/:siteStructureId`,
		siteStructureDetailSettings: `${SITE_ROOT}/sitestructuren/:siteStructureId/instellingen`,
		siteStructureItems: `${SITE_ROOT}/sitestructuren/:siteStructureId/sitestructuur-items`,
		createContentRefSiteStructureItem: `${SITE_ROOT}/sitestructuren/:siteStructureId/sitestructuur-items/content-referentie/aanmaken`,
		createContentRefSiteStructureItemSettings: `${SITE_ROOT}/sitestructuren/:siteStructureId/sitestructuur-items/content-referentie/aanmaken/instellingen`,
		contentRefSiteStructureItemDetail: `${SITE_ROOT}/sitestructuren/:siteStructureId/sitestructuur-items/content-referentie/:siteStructureItemId`,
		contentRefSiteStructureItemDetailSettings: `${SITE_ROOT}/sitestructuren/:siteStructureId/sitestructuur-items/content-referentie/:siteStructureItemId/instellingen`,
	},
};

export const BREADCRUMB_OPTIONS = (
	generatePath: NavigateGenerateFn,
	extraBreadcrumbs: Breadcrumb[] = []
): BreadcrumbOptions => ({
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}/sites`,
		`${TENANT_ROOT}${MENUS_BASE_PATH}`,
		`${TENANT_ROOT}${SITE_STRUCTURES_BASE_PATH}`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${MENUS_DETAIL_BASE_PATH}/menu-items`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${MENUS_DETAIL_BASE_PATH}/menu-items/content-referentie`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${SITE_STRUCTURES_DETAIL_BASE_PATH}/sitestructuur-items`,
		`${TENANT_ROOT}/${SITES_ROOT}${SITE_ROOT}([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})${SITE_STRUCTURES_DETAIL_BASE_PATH}/sitestructuur-items/content-referentie`,
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

export const SITE_STRUCTURE_DETAIL_TAB_MAP: {
	[key in 'settings' | 'siteStructureItems']: ContextHeaderTab;
} = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
		disabled: false,
	},
	siteStructureItems: {
		name: 'Sitestructuur-items',
		target: 'sitestructuur-items',
		active: false,
		disabled: false,
	},
};

export const MENU_DETAIL_TABS: ContextHeaderTab[] = [
	MENU_DETAIL_TAB_MAP.settings,
	MENU_DETAIL_TAB_MAP.menuItems,
];

export const SITE_STRUCTURE_DETAIL_TABS: ContextHeaderTab[] = [
	SITE_STRUCTURE_DETAIL_TAB_MAP.settings,
	SITE_STRUCTURE_DETAIL_TAB_MAP.siteStructureItems,
];

export const CONFIG: Readonly<{ name: string; module: string }> = {
	name: 'navigation',
	module: 'navigation-module',
};

export const ALERT_CONTAINER_IDS = {
	settings: 'settings',
	overview: 'overview',
	menuItemsOverview: 'menu-items-overview',
	siteStructureItemsOverview: 'site-structure-items-overview',
};

export enum LangKeys {
	generic = 'generic',
}

export const LANG_OPTIONS = [
	{ key: LangKeys.generic, label: 'Taalonafhankelijk (alle talen)', value: LangKeys.generic },
];
