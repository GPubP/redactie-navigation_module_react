import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useOnNextRender,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { generateEmptyNavItem, getNavItemType } from '../../../helpers';
import { useMenu, useMenuItem, useMenuItemDraft, useMenuItems } from '../../../hooks';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../../navigation.const';
import { MenuItemMatchProps, NavigationModuleProps } from '../../../navigation.types';
import { MenuItemModel, menuItemsFacade } from '../../../store/menuItems';

const MenuItemCreate: FC<NavigationModuleProps<MenuItemMatchProps>> = ({
	location,
	route,
	match,
}) => {
	const { siteId, menuId } = match.params;

	/**
	 * Hooks
	 */
	const { menuItem } = useMenuItem();
	const [menuItemDraft] = useMenuItemDraft();
	const { menu } = useMenu();
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const { upsertingState, fetchingState } = useMenuItems();
	const [t] = translationsConnector.useCoreTranslation();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath, [
			{
				name: "Menu's",
				target: generatePath(MODULE_PATHS.site.menusOverview, { siteId }),
			},
			...(menu?.label
				? [
						{
							name: menu?.label,
							target: generatePath(MODULE_PATHS.site.menuItems, { siteId, menuId }),
						},
				  ]
				: []),
		])
	);
	const isLoading = useMemo(() => {
		return upsertingState === LoadingState.Loading || fetchingState === LoadingState.Loading;
	}, [fetchingState, upsertingState]);

	const [forceNavigateToOverview] = useOnNextRender(() =>
		navigate(MODULE_PATHS.site.menuItems, {
			siteId,
			menuId,
		})
	);

	useEffect(() => {
		menuItemsFacade.setMenuItem(generateEmptyNavItem());
		menuItemsFacade.setMenuItemDraft(generateEmptyNavItem());
	}, []);

	/**
	 * Methods
	 */
	const createItem = (payload: MenuItemModel): void => {
		menuItemsFacade
			.createMenuItem(siteId, menuId, payload, ALERT_CONTAINER_IDS.menuItemsOverview)
			.then(response => {
				if (response && response.id) {
					forceNavigateToOverview();
				}
			});
	};

	/**
	 * Render
	 */

	const menuItemType = getNavItemType(location.pathname);
	const pageTitle = `Menu-item ${t(CORE_TRANSLATIONS.ROUTING_CREATE)}`;

	const renderChildRoutes = (): ReactElement => (
		<RenderChildRoutes
			routes={route.routes}
			extraOptions={{
				loading: isLoading,
				onCancel: () => navigate(MODULE_PATHS.overview),
				onSubmit: createItem,
				menu,
				menuItem,
				menuItemDraft,
				menuItemType,
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
			<Container>
				<div className="u-margin-top">{renderChildRoutes()}</div>
			</Container>
		</>
	);
};

export default MenuItemCreate;
