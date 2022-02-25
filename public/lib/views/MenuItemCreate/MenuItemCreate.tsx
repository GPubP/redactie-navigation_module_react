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

import sitesConnector from '../../connectors/sites';
import { useMenuItem, useMenuItemDraft } from '../../hooks';
import { generateEmptyMenuItem } from '../../menu.helpers';
import { MenuItemMatchProps, MenuModuleProps } from '../../menu.types';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MENU_DETAIL_TAB_MAP,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../navigation.const';
import { MenuItem } from '../../services/menuItems';
import { menuItemsFacade } from '../../store/menuItems';

const MenuItemCreate: FC<MenuModuleProps<MenuItemMatchProps>> = ({ tenantId, route, match }) => {
	const { siteId, menuUuid } = match.params;

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
				name: 'Menus',
				target: generatePath(MODULE_PATHS.site.overview, { siteId }),
			},
		])
	);
	const [menuItemDraft] = useMenuItemDraft();
	const {
		fetchingState: menuItemLoadingState,
		menuItem,
		upsertingState: upsertMenuItemLoadingState,
	} = useMenuItem();
	const isLoading = useMemo(() => {
		return (
			menuItemLoadingState === LoadingState.Loading ||
			upsertMenuItemLoadingState === LoadingState.Loading
		);
	}, [upsertMenuItemLoadingState, menuItemLoadingState]);

	useEffect(() => {
		if (menuItemLoadingState !== LoadingState.Loading) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [menuItemLoadingState]);

	useEffect(() => {
		if (menuItem?.id) {
			navigate(`${MODULE_PATHS.site.detailSettings}`, { siteId, menuItemUuid: menuItem.id });
		}
	}, [navigate, siteId, menuItem]);

	useEffect(() => {
		if (!menuItemDraft && site) {
			menuItemsFacade.setMenuItem(generateEmptyMenuItem(site?.data.name));
			menuItemsFacade.setMenuItemDraft(generateEmptyMenuItem(site?.data.name));
		}
	}, [menuItemDraft, site]);

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
				menuItemsFacade.createMenuItem(
					siteId,
					menuUuid,
					{
						...generateEmptyMenuItem(menuUuid),
						...sectionData,
					} as MenuItem,
					alertId
				);
				break;
		}
	};

	/**
	 * Render
	 */
	const pageTitle = `Menu item aanmaken`;

	const renderChildRoutes = (): ReactElement => (
		<RenderChildRoutes
			routes={route.routes}
			extraOptions={{
				tenantId,
				routes: route.routes,
				menuItem: menuItem || generateEmptyMenuItem(menuUuid),
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
				title={pageTitle}
				badges={[
					{
						name: 'Menu-item',
						type: 'primary',
					},
				]}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<div className="u-margin-top">
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</div>
		</>
	);
};

export default MenuItemCreate;
