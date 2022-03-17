import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	ContextHeaderTab,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import sitesConnector from '../../../connectors/sites';
import { generateEmptySiteStructure } from '../../../helpers/generateEmptySiteStructure';
import { useActiveTabs, useSiteStructure, useSiteStructureDraft } from '../../../hooks';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MODULE_PATHS,
	SITE_STRUCTURE_DETAIL_TAB_MAP,
	SITE_STRUCTURE_DETAIL_TABS,
	SITES_ROOT,
} from '../../../navigation.const';
import { NavigationMatchProps, NavigationModuleProps } from '../../../navigation.types';
import { SiteStructure } from '../../../services/siteStructures';
import { siteStructuresFacade } from '../../../store/siteStructures';

const SiteStructureCreate: FC<NavigationModuleProps<NavigationMatchProps>> = ({
	tenantId,
	route,
	match,
}) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loaded);
	const [site] = sitesConnector.hooks.useSite(siteId);
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath, [
			{
				name: 'Sitestructuren',
				target: generatePath(MODULE_PATHS.site.siteStructuresOverview, { siteId }),
			},
		])
	);
	const activeTabs = useActiveTabs(SITE_STRUCTURE_DETAIL_TABS, location.pathname);
	const [siteStructureDraft] = useSiteStructureDraft();
	const {
		siteStructure,
		fetchingState: siteStructureLoadingState,
		upsertingState: upsertSiteStructureLoadingState,
	} = useSiteStructure();
	const isLoading = useMemo(() => {
		return (
			siteStructureLoadingState === LoadingState.Loading ||
			upsertSiteStructureLoadingState === LoadingState.Loading
		);
	}, [upsertSiteStructureLoadingState, siteStructureLoadingState]);

	useEffect(() => {
		if (siteStructureLoadingState !== LoadingState.Loading) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [siteStructureLoadingState]);

	useEffect(() => {
		if (siteStructure?.id) {
			navigate(`${MODULE_PATHS.site.siteStructureDetailSettings}`, {
				siteId,
				siteStructureId: siteStructure.id,
			});
		}
	}, [navigate, siteId, siteStructure]);

	useEffect(() => {
		if (!siteStructureDraft && site) {
			siteStructuresFacade.setSiteStructure(
				(generateEmptySiteStructure(site?.data.name) as unknown) as SiteStructure
			);
			siteStructuresFacade.setSiteStructureDraft(
				(generateEmptySiteStructure(site?.data.name) as unknown) as SiteStructure
			);
		}
	}, [site, siteStructureDraft]);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(`${MODULE_PATHS.root}`, { siteId });
	};

	const upsertView = (
		sectionData: any,
		tab: ContextHeaderTab,
		alertId = ALERT_CONTAINER_IDS.settings
	): void => {
		switch (tab.name) {
			case SITE_STRUCTURE_DETAIL_TAB_MAP.settings.name:
				siteStructuresFacade.createSiteStructure(
					siteId,
					{
						...generateEmptySiteStructure(site?.data.name),
						...sectionData,
					} as SiteStructure,
					alertId
				);
				break;
		}
	};

	/**
	 * Render
	 */
	const pageTitle = `Sitestructuur aanmaken`;

	const renderChildRoutes = (): ReactElement => (
		<RenderChildRoutes
			routes={route.routes}
			extraOptions={{
				tenantId,
				routes: route.routes,
				siteStructure: siteStructure || generateEmptySiteStructure(site?.data.name),
				loading: isLoading,
				isCreating: true,
				onCancel: navigateToOverview,
				onSubmit: (sectionData: any, tab: ContextHeaderTab) => upsertView(sectionData, tab),
			}}
		/>
	);

	return (
		<>
			<ContextHeader
				tabs={activeTabs.slice(0, 1)}
				linkProps={(props: any) => ({
					...props,
					to: generatePath(`${route.path}/${props.href}`, { siteId }),
					component: Link,
				})}
				title={pageTitle}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container className="u-margin-top">
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default SiteStructureCreate;
