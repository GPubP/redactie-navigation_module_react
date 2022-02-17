// import { akitaDevtools } from '@datorama/akita';
import { ContentSchema } from '@redactie/content-module';
import { ContentCompartmentModel } from '@redactie/content-module/dist/lib/store/ui/contentCompartments';
import { MySecurityRightModel } from '@redactie/roles-rights-module';
import { RenderChildRoutes, SiteContext, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';
import { take } from 'rxjs/operators';

import { ContentDetailCompartment, ContentTypeDetailTab } from './lib/components';
import {
	MINIMAL_VALIDATION_SCHEMA,
	VALIDATION_SCHEMA,
} from './lib/components/ContentDetailCompartment/ContentDetailCompartment.const';
import { registerContentDetailCompartment } from './lib/connectors/content';
import contentTypeConnector from './lib/connectors/contentTypes';
import rolesRightsConnector from './lib/connectors/rolesRights';
import sitesConnector from './lib/connectors/sites';
import { isEmpty } from './lib/helpers';
import { afterSubmit, beforeSubmit } from './lib/helpers/contentCompartmentHooks';
import { MenuModuleProps } from './lib/menu.types';
import { CONFIG, MODULE_PATHS } from './lib/navigation.const';
import { MenuCreate, MenuDetailSettings, MenuOverview } from './lib/views';

// akitaDevtools();

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
	breadcrumb: null,
	component: MenuComponent,
	redirect: MODULE_PATHS.site.overview,
	guards: [
		rolesRightsConnector.api.guards.securityRightsSiteGuard('siteId', [
			rolesRightsConnector.securityRights.read,
		]),
	],
	navigation: {
		renderContext: 'site',
		context: 'site',
		label: 'Menu',
		order: 0,
		parentPath: MODULE_PATHS.site.contentTypes,
		canShown: [
			rolesRightsConnector.api.canShowns.securityRightsSiteCanShown('siteId', [
				rolesRightsConnector.securityRights.read,
			]),
		],
	},
	routes: [
		{
			path: MODULE_PATHS.site.overview,
			breadcrumb: null,
			component: MenuOverview,
		},
		{
			path: MODULE_PATHS.site.create,
			breadcrumb: null,
			component: MenuCreate,
			redirect: MODULE_PATHS.site.createSettings,
			routes: [
				{
					path: MODULE_PATHS.site.createSettings,
					breadcrumb: null,
					component: MenuDetailSettings,
				},
			],
		},
	],
});

registerContentDetailCompartment(CONFIG.name, {
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

contentTypeConnector.registerCTDetailTab(CONFIG.name, {
	label: 'Navigatie',
	module: CONFIG.module,
	component: ContentTypeDetailTab,
	containerId: 'update' as any,
	show: (context: any) => context.ctType === 'content-types',
	disabled: false,
} as any);
