import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
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

import sitesConnector from '../../connectors/sites';
import { useCoreTranslation } from '../../connectors/translations';
import { useActiveTabs, useMenu, useMenuDraft } from '../../hooks';
import { generateEmptyMenu } from '../../menu.helpers';
import { MenuMatchProps, MenuModuleProps } from '../../menu.types';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MENU_DETAIL_TAB_MAP,
	MENU_DETAIL_TABS,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../navigation.const';
import { Menu } from '../../services/menus';
import { menusFacade } from '../../store/menus';

const MenuCreate: FC<MenuModuleProps<MenuMatchProps>> = ({ tenantId, route, match }) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loaded);
	const [t] = useCoreTranslation();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);
	const activeTabs = useActiveTabs(MENU_DETAIL_TABS, location.pathname);
	const [menuDraft] = useMenuDraft();
	const {
		fetchingState: menuLoadingState,
		menu,
		upsertingState: upsertMenuLoadingState,
	} = useMenu();
	const isLoading = useMemo(() => {
		return (
			menuLoadingState === LoadingState.Loading ||
			upsertMenuLoadingState === LoadingState.Loading
		);
	}, [upsertMenuLoadingState, menuLoadingState]);

	useEffect(() => {
		if (menuLoadingState !== LoadingState.Loading) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [menuLoadingState]);

	useEffect(() => {
		if (menu?.id) {
			navigate(`${MODULE_PATHS.site.detailSettings}`, { siteId, menuUuid: menu.id });
		}
	}, [navigate, siteId, menu]);

	useEffect(() => {
		if (!menuDraft && site) {
			menusFacade.setMenu(generateEmptyMenu(site?.data.name));
			menusFacade.setMenuDraft(generateEmptyMenu(site?.data.name));
		}
	}, [menuDraft, site]);

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
			case MENU_DETAIL_TAB_MAP.settings.name:
				menusFacade.createMenu(
					siteId,
					{
						...generateEmptyMenu(site?.data.name),
						...sectionData,
					} as Menu,
					alertId
				);
				break;
		}
	};

	/**
	 * Render
	 */
	const pageTitle = `Menu aanmaken`;

	const renderChildRoutes = (): ReactElement => (
		<RenderChildRoutes
			routes={route.routes}
			extraOptions={{
				tenantId,
				routes: route.routes,
				menu: menu || generateEmptyMenu(site?.data.name),
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
			<div className="u-margin-top">
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</div>
		</>
	);
};

export default MenuCreate;
