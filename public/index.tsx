// import { akitaDevtools } from '@datorama/akita';
import { ContentSchema } from '@redactie/content-module';
import { ContentCompartmentModel } from '@redactie/content-module/dist/lib/store/ui/contentCompartments';
import { ChildModuleRouteConfig } from '@redactie/redactie-core';
import { MySecurityRightModel } from '@redactie/roles-rights-module';
import { ModuleSettings } from '@redactie/sites-module';
import { RenderChildRoutes, SiteContext, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';
import { take } from 'rxjs/operators';

import { menuCanShown, siteStructureCanShown } from './lib/canShowns';
import {
	ContentDetailCompartment,
	ContentDetailMenuCompartment,
	ContentDetailUrlCompartment,
	ContentTypeDetailMenu,
	ContentTypeDetailSiteStructure,
	ContentTypeDetailTab,
	ContentTypeDetailUrl,
	SiteNavigationTab,
} from './lib/components';
import {
	MINIMAL_VALIDATION_SCHEMA,
	VALIDATION_SCHEMA,
} from './lib/components/ContentDetailCompartment/ContentDetailCompartment.const';
import { ContentDetailNavigationStructureCompartment } from './lib/components/ContentDetailNavigationStructureCompartment';
import contentConnector from './lib/connectors/content';
import contentTypeConnector from './lib/connectors/contentTypes';
import rolesRightsConnector from './lib/connectors/rolesRights';
import sitesConnector from './lib/connectors/sites';
import { menuGuard, siteStructureGuard } from './lib/guards';
import { isEmpty } from './lib/helpers';
import {
	afterSubmitMenu,
	afterSubmitNavigation,
	beforeSubmitNavigation,
	afterSubmitSiteStructure,
	beforeSubmitSiteStructure,
} from './lib/helpers/contentCompartmentHooks';
import { registerTranslations } from './lib/i18next';
import { CONFIG, MODULE_PATHS, PositionValues } from './lib/navigation.const';
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
	guardOptions: {
		guards: [
			rolesRightsConnector.api.guards.securityRightsSiteGuard('siteId', [
				rolesRightsConnector.menuSecurityRights.read,
			]),
			menuGuard,
		],
	},
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
			menuCanShown,
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
			path: MODULE_PATHS.site.createHyperLinkMenuItem,
			breadcrumb: false,
			component: MenuItemCreate,
			redirect: MODULE_PATHS.site.createHyperLinkMenuItemSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createHyperLinkMenuItemSettings,
					breadcrumb: false,
					component: MenuItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.hyperLinkMenuItemDetail,
			breadcrumb: false,
			component: MenuItemUpdate,
			redirect: MODULE_PATHS.site.hyperLinkMenuItemDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.hyperLinkMenuItemDetailSettings,
					breadcrumb: false,
					component: MenuItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.createSubtitleMenuItem,
			breadcrumb: false,
			component: MenuItemCreate,
			redirect: MODULE_PATHS.site.createSubtitleMenuItemSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createSubtitleMenuItemSettings,
					breadcrumb: false,
					component: MenuItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.subtitleMenuItemDetail,
			breadcrumb: false,
			component: MenuItemUpdate,
			redirect: MODULE_PATHS.site.subtitleMenuItemDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.subtitleMenuItemDetailSettings,
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
	guardOptions: {
		guards: [
			rolesRightsConnector.api.guards.securityRightsSiteGuard('siteId', [
				rolesRightsConnector.siteStructuresSecurityRights.read,
			]),
			siteStructureGuard,
		],
	},
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
			siteStructureCanShown,
		],
	},
	routes: [
		{
			path: MODULE_PATHS.site.siteStructuresOverview,
			breadcrumb: false,
			component: SiteStructureOverview,
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
			path: MODULE_PATHS.site.createHyperlinkSiteStructureItem,
			breadcrumb: false,
			component: SiteStructureItemCreate,
			redirect: MODULE_PATHS.site.createHyperlinkSiteStructureItemSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createHyperlinkSiteStructureItemSettings,
					breadcrumb: false,
					component: SiteStructureItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.hyperlinkSiteStructureItemDetail,
			breadcrumb: false,
			component: SiteStructureItemUpdate,
			redirect: MODULE_PATHS.site.hyperlinkSiteStructureItemDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.hyperlinkSiteStructureItemDetailSettings,
					breadcrumb: false,
					component: SiteStructureItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.createSubtitleSiteStructureItem,
			breadcrumb: false,
			component: SiteStructureItemCreate,
			redirect: MODULE_PATHS.site.createSubtitleSiteStructureItemSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createSubtitleSiteStructureItemSettings,
					breadcrumb: false,
					component: SiteStructureItemDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.site.subtitleSiteStructureItemDetail,
			breadcrumb: false,
			component: SiteStructureItemUpdate,
			redirect: MODULE_PATHS.site.subtitleSiteStructureItemDetailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.subtitleSiteStructureItemDetailSettings,
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
	beforeSubmit: beforeSubmitNavigation,
	afterSubmit: afterSubmitNavigation,
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

contentConnector.registerContentDetailCompartment(`${CONFIG.name}-url`, {
	label: 'URL',
	module: CONFIG.module,
	component: ContentDetailUrlCompartment,
	isValid: false,
	beforeSubmit: beforeSubmitNavigation,
	afterSubmit: afterSubmitNavigation,
	validate: (values: ContentSchema, activeCompartment: ContentCompartmentModel) => {
		const navModuleValue = values.modulesData?.navigation || {};

		if (activeCompartment.name === CONFIG.name || isEmpty(navModuleValue.id)) {
			return VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
		}

		return MINIMAL_VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
	},
	show: (context, settings) => {
		let securityRights: string[] = [];

		rolesRightsConnector.api.store.mySecurityRights.query
			.siteRights$(settings?.config?.siteUuid)
			.pipe(take(1))
			.subscribe((rights: MySecurityRightModel[]) => {
				securityRights = rights.map(right => right.attributes.key);
			});

		return rolesRightsConnector.api.helpers.checkSecurityRights(securityRights, [
			rolesRightsConnector.securityRights.readUrl,
		]);
	},
});

contentConnector.registerContentDetailCompartment(`${CONFIG.name}-menu`, {
	label: "Menu's",
	module: CONFIG.module,
	component: ContentDetailMenuCompartment,
	isValid: true,
	afterSubmit: afterSubmitMenu,
	show: (context, settings, value, content, contentType, site) => {
		return (
			(site?.data?.modulesConfig || []).find(
				(siteNavigationConfig: ModuleSettings) =>
					siteNavigationConfig?.name === 'navigation'
			)?.config?.allowMenus ?? false
		);
	},
	validate: () => true,
});

contentConnector.registerContentDetailCompartment(`${CONFIG.name}-navigationstructure`, {
	label: 'Navigatiestructuur',
	module: CONFIG.module,
	component: ContentDetailNavigationStructureCompartment,
	isValid: false,
	beforeSubmit: beforeSubmitSiteStructure,
	afterSubmit: afterSubmitSiteStructure,
	validate: (values: ContentSchema, activeCompartment: ContentCompartmentModel) => {
		const navModuleValue = values.modulesData?.navigation || {};

		if (activeCompartment.name === CONFIG.name || isEmpty(navModuleValue.id)) {
			return VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
		}

		return MINIMAL_VALIDATION_SCHEMA.isValidSync(values.modulesData?.navigation);
	},
	show: (_, __, ___, ____, contentType) => {
		const siteNavigationConfig = (contentType.modulesConfig || []).find(
			config => config.name === 'navigation' && config.site
		);

		if (
			!siteNavigationConfig ||
			siteNavigationConfig?.config?.sitestructuur?.structurePosition === PositionValues.none
		) {
			return false;
		}

		return true;
	},
});

export const tenantContentTypeDetailTabRoutes: ChildModuleRouteConfig[] = [
	{
		path: MODULE_PATHS.tenantContentTypeDetailExternalUrl,
		breadcrumb: false,
		component: ContentTypeDetailUrl,
		guardOptions: {
			guards: [
				rolesRightsConnector.guards.securityRightsTenantGuard([
					rolesRightsConnector.securityRights.readUrlPattern,
				]),
			],
		},
	},
];

export const siteContentTypeDetailTabRoutes: ChildModuleRouteConfig[] = [
	{
		path: MODULE_PATHS.site.contentTypeDetailExternalUrl,
		breadcrumb: false,
		component: ContentTypeDetailUrl,
		guardOptions: {
			guards: [
				rolesRightsConnector.api.guards.securityRightsSiteGuard('siteId', [
					rolesRightsConnector.securityRights.readUrlPattern,
				]),
			],
		},
	},
	{
		path: MODULE_PATHS.site.contentTypeDetailExternalMenu,
		breadcrumb: false,
		component: ContentTypeDetailMenu,
		guardOptions: {
			guards: [
				rolesRightsConnector.api.guards.securityRightsSiteGuard('siteId', [
					rolesRightsConnector.menuSecurityRights.read,
				]),
			],
		},
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
	show: context => context.isActive,
	disabled: context =>
		!rolesRightsConnector.api.helpers.checkSecurityRights(context.mySecurityrights, [
			rolesRightsConnector.securityRights.read,
		]) || context.contentType?.meta?.canBeFiltered === false,
});

sitesConnector.registerSiteUpdateTab(CONFIG.name, {
	label: 'Navigatie',
	module: CONFIG.module,
	component: SiteNavigationTab,
	containerId: 'update' as any,
});
