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
	ContentTypeDetailTab,
	ContentTypeDetailUrl,
} from './lib/components';
import {
	MINIMAL_VALIDATION_SCHEMA,
	VALIDATION_SCHEMA,
} from './lib/components/ContentDetailCompartment/ContentDetailCompartment.const';
import SiteStructureTab from './lib/components/SiteStructureTab/SiteStructureTab';
import contentConnector from './lib/connectors/content';
import contentTypeConnector from './lib/connectors/contentTypes';
import rolesRightsConnector from './lib/connectors/rolesRights';
import sitesConnector from './lib/connectors/sites';
import { isEmpty } from './lib/helpers';
import { afterSubmit, beforeSubmit } from './lib/helpers/contentCompartmentHooks';
import { registerTranslations } from './lib/i18next';
import { MenuModuleProps } from './lib/menu.types';
import { CONFIG, MODULE_PATHS } from './lib/navigation.const';
import {
	MenuCreate,
	MenuDetailSettings,
	MenuItemCreate,
	MenuItemDetailSettings,
	MenuItemsOverview,
	MenuItemUpdate,
	MenuOverview,
	MenuUpdate,
} from './lib/views';

// akitaDevtools();

console.log("HelloNavModule")
registerTranslations();

const MenuComponent: FC<MenuModuleProps<{ siteId: string }>> = ({ route, tenantId, match }) => {
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
	path: MODULE_PATHS.site.root,
	breadcrumb: false,
	component: MenuComponent,
	redirect: MODULE_PATHS.site.overview,
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
		{
			path: MODULE_PATHS.site.overview,
			breadcrumb: false,
			component: MenuOverview,
		},
		{
			path: MODULE_PATHS.site.create,
			breadcrumb: false,
			component: MenuCreate,
			redirect: MODULE_PATHS.site.createSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createSettings,
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
			path: MODULE_PATHS.site.detail,
			breadcrumb: false,
			component: MenuUpdate,
			redirect: MODULE_PATHS.site.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.site.detailSettings,
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
];

contentTypeConnector.registerCTDetailTab(CONFIG.name, {
	label: 'Navigatie',
	module: CONFIG.module,
	component: ContentTypeDetailTab,
	containerId: 'update' as any,
	show: (context: any) => context.ctType === 'content-types',
	disabled: false,
} as any);

sitesConnector.registerSiteStructureTab(CONFIG.name, {
	label: 'Sitestructuur',
	module: CONFIG.module,
	component: SiteStructureTab,
	containerId: 'update' as any,
});

