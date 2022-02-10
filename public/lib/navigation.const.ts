import { BreadcrumbOptions } from '@redactie/redactie-core';
import { NavigateGenerateFn } from '@redactie/utils';

export const TENANT_ROOT = '/:tenantId';
export const SITE_ROOT = `/:siteId`;
export const root = '/menus';

export const MODULE_PATHS = {
	admin: `/content/overzicht`,

	root,
	overview: `${root}/overzicht`,

	create: `${root}/aanmaken`,
		// SITE
		site: {
			contentTypes: `${SITE_ROOT}/:ctType(content-types|content-blokken)`,
		    admin: `${SITE_ROOT}/content/overzicht`,
			dashboard: `${SITE_ROOT}/content`,
			root: `${SITE_ROOT}/menus`,
			overview: `${SITE_ROOT}/menus/overzicht`,		},

};

export const BREADCRUMB_OPTIONS = (generatePath: NavigateGenerateFn): BreadcrumbOptions => ({
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
	],
});


export const CONFIG: Readonly<{ name: string; module: string }> = {
	name: 'navigation',
	module: 'navigation-module',
};
