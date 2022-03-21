// import { akitaDevtools } from '@datorama/akita';
import { ContentSchema } from '@redactie/content-module';
import { ContentCompartmentModel } from '@redactie/content-module/dist/lib/store/ui/contentCompartments';
import { ChildModuleRouteConfig } from '@redactie/redactie-core';
import { MySecurityRightModel } from '@redactie/roles-rights-module';
import { RenderChildRoutes, SiteContext, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';
import { take } from 'rxjs/operators';

import {
	ContentDetailCompartment,
	ContentTypeDetailMenu,
	ContentTypeDetailSiteStructure,
	ContentTypeDetailTab,
	ContentTypeDetailUrl,
} from './lib/components';
import {
	MINIMAL_VALIDATION_SCHEMA,
	VALIDATION_SCHEMA,
} from './lib/components/ContentDetailCompartment/ContentDetailCompartment.const';
import contentConnector from './lib/connectors/content';
import contentTypeConnector from './lib/connectors/contentTypes';
import rolesRightsConnector from './lib/connectors/rolesRights';
import sitesConnector from './lib/connectors/sites';
import { isEmpty } from './lib/helpers';
import { afterSubmit, beforeSubmit } from './lib/helpers/contentCompartmentHooks';
import { registerTranslations } from './lib/i18next';
import { CONFIG, MODULE_PATHS } from './lib/navigation.const';
import { NavigationModuleProps } from './lib/navigation.types';
import {
	MenuCreate,
	MenuDetailSettings,
	MenuItemCreate,
	MenuItemDetailSettings,
	MenuItemsOverview,
	MenuItemUpdate,
	MenuOverview,
	MenuUpdate,
	SiteStructureCreate,
	SiteStructureDetailSettings,
	SiteStructureItemCreate,
	SiteStructureItemDetailSettings,
	SiteStructureItemsOverview,
	SiteStructureItemUpdate,
	SiteStructureOverview,
	SiteStructureUpdate,
} from './lib/views';

// akitaDevtools();

registerTranslations();

const NavigationComponent: FC<NavigationModuleProps<{ siteId: string }>> = ({
	route,
	tenantId,
	match,
}) => {
	const { siteId } = match.params;
	const guardsMeta = useMemo(() => ({ tenantId, siteId }), [siteId, tenantId]);

	return (
		<TenantContext.Provider value={{ tenantId }}>
			<SiteContext.Provider value={{ siteId }}>
				<RenderChildRoutes routes={route.routes} guardsMeta={guardsMeta} />
			</SiteContext.Provider>
		</TenantContext.Provider>
	);
};

sitesConnector.registerRoutes({
	path: MODULE_PATHS.site.menuRoot,
	breadcrumb: false,
	component: NavigationComponent,
	redirect: MODULE_PATHS.site.menusOverview,
	guards: [
		rolesRightsConnector.api.guards.securityRightsSiteGuard('siteId', [
			rolesRightsConnector.menuSecurityRights.read,
		]),
	],
	navigation: {
		renderContext: 'site',
		context: 'site',
		label: "Menu's",
		order: 2,
		parentPath: MODULE_PATHS.site.explicitContentTypes,
		canShown: [
			rolesRightsConnector.api.canShowns.securityRightsSiteCanShown('siteId', [
				rolesRightsConnector.menuSecurityRights.read,
			]),
		],
	},
	routes: [
		// MENU
		{
			path: MODULE_PATHS.site.menusOverview,
			breadcrumb: false,
			component: MenuOverview,
		},
		{
			path: MODULE_PATHS.site.createMenu,
			breadcrumb: false,
			component: MenuCreate,
			redirect: MODULE_PATHS.site.createMenuSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createMenuSettings,
					breadcrumb: false,
					component: MenuDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.createContentRefMenuItem,
			breadcrumb: false,
			component: MenuItemCreate,
			redirect: MODULE_PATHS.site.createContentRefMenuItemSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createContentRefMenuItemSettings,
					breadcrumb: false,
					component: MenuItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.contentRefMenuItemDetail,
			breadcrumb: false,
			component: MenuItemUpdate,
			redirect: MODULE_PATHS.site.contentRefMenuItemDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.contentRefMenuItemDetailSettings,
					breadcrumb: false,
					component: MenuItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.menuDetail,
			breadcrumb: false,
			component: MenuUpdate,
			redirect: MODULE_PATHS.site.menuDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.menuDetailSettings,
					breadcrumb: false,
					component: MenuDetailSettings,
				},
				{
					path: MODULE_PATHS.site.menuItems,
					breadcrumb: false,
					component: MenuItemsOverview,
				},
			],
		},
	],
});

sitesConnector.registerRoutes({
	path: MODULE_PATHS.site.siteStrucureRoot,
	breadcrumb: false,
	component: NavigationComponent,
	redirect: MODULE_PATHS.site.siteStructuresOverview,
	guards: [
		rolesRightsConnector.api.guards.securityRightsSiteGuard('siteId', [
			rolesRightsConnector.siteStructuresSecurityRights.read,
		]),
	],
	navigation: {
		renderContext: 'site',
		context: 'site',
		label: 'Sitestructuren',
		order: 3,
		parentPath: MODULE_PATHS.site.explicitContentTypes,
		canShown: [
			rolesRightsConnector.api.canShowns.securityRightsSiteCanShown('siteId', [
				rolesRightsConnector.siteStructuresSecurityRights.read,
			]),
		],
	},
	routes: [
		{
			path: MODULE_PATHS.site.siteStructuresOverview,
			breadcrumb: false,
			component: SiteStructureOverview,
		},
		{
			path: MODULE_PATHS.site.createSiteStructure,
			breadcrumb: false,
			component: SiteStructureCreate,
			redirect: MODULE_PATHS.site.createSiteStructureSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createSiteStructureSettings,
					breadcrumb: false,
					component: SiteStructureDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.createContentRefSiteStructureItem,
			breadcrumb: false,
			component: SiteStructureItemCreate,
			redirect: MODULE_PATHS.site.createContentRefSiteStructureItemSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createContentRefSiteStructureItemSettings,
					breadcrumb: false,
					component: SiteStructureItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.contentRefSiteStructureItemDetail,
			breadcrumb: false,
			component: SiteStructureItemUpdate,
			redirect: MODULE_PATHS.site.contentRefSiteStructureItemDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.contentRefSiteStructureItemDetailSettings,
					breadcrumb: false,
					component: SiteStructureItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.siteStructureDetail,
			breadcrumb: false,
			component: SiteStructureUpdate,
			redirect: MODULE_PATHS.site.siteStructureDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.siteStructureDetailSettings,
					breadcrumb: false,
					component: SiteStructureDetailSettings,
				},
				{
					path: MODULE_PATHS.site.siteStructureItems,
					breadcrumb: false,
					component: SiteStructureItemsOverview,
				},
			],
		},
	],
});

contentConnector.registerContentDetailCompartment(CONFIG.name, {
	label: 'Navigatie',
	getDescription: contentItem => contentItem?.meta.slug.nl || '',
	module: CONFIG.module,
	component: ContentDetailCompartment,
	isValid: false,
	beforeSubmit,
	afterSubmit,
	validate: (values: ContentSchema, activeCompartment: ContentCompartmentModel) => {
		const navModuleValue = values.modulesData?.navigation || {};

		if (activeCompartment.name === CONFIG.name || isEmpty(navModuleValue.id)) {
			return VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
		}

		return MINIMAL_VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
	},
	show: (context, settings, value) => {
		let securityRights: string[] = [];

		rolesRightsConnector.api.store.mySecurityRights.query
			.siteRights$(settings?.config?.siteUuid)
			.pipe(take(1))
			.subscribe((rights: MySecurityRightModel[]) => {
				securityRights = rights.map(right => right.attributes.key);
			});

		const requiredRights = !value?.navigationTree
			? [rolesRightsConnector.securityRights.create, rolesRightsConnector.securityRights.read]
			: [rolesRightsConnector.securityRights.read];

		return (
			settings?.config?.activateTree === 'true' &&
			rolesRightsConnector.api.helpers.checkSecurityRights(securityRights, requiredRights)
		);
	},
});

export const tenantContentTypeDetailTabRoutes: ChildModuleRouteConfig[] = [
	{
		path: MODULE_PATHS.tenantContentTypeDetailExternalUrl,
		breadcrumb: false,
		component: ContentTypeDetailUrl,
	},
];

export const siteContentTypeDetailTabRoutes: ChildModuleRouteConfig[] = [
	{
		path: MODULE_PATHS.tenantContentTypeDetailExternalUrl,
		breadcrumb: false,
		component: ContentTypeDetailUrl,
	},
	{
		path: MODULE_PATHS.site.contentTypeDetailExternalUrl,
		breadcrumb: false,
		component: ContentTypeDetailUrl,
	},
	{
		path: MODULE_PATHS.site.contentTypeDetailExternalMenu,
		breadcrumb: false,
		component: ContentTypeDetailMenu,
	},
	{
		path: MODULE_PATHS.site.contentTypeDetailExternalSiteStructure,
		breadcrumb: false,
		component: ContentTypeDetailSiteStructure,
	},
];

contentTypeConnector.registerCTDetailTab(CONFIG.name, {
	label: 'Navigatie',
	module: CONFIG.module,
	component: ContentTypeDetailTab,
	containerId: 'update' as any,
	show: (context: any) => context.ctType === 'content-types',
	disabled: false,
});
