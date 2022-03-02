import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useOnNextRender,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenuItems } from '../../hooks';
import { generateEmptyMenuItem } from '../../menu.helpers';
import { MenuItemMatchProps, MenuModuleProps } from '../../menu.types';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../navigation.const';
import { MenuItemModel, menuItemsFacade } from '../../store/menuItems';

const MenuItemCreate: FC<MenuModuleProps<MenuItemMatchProps>> = ({ route, match }) => {
	const { siteId, menuId } = match.params;

	/**
	 * Hooks
	 */
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const { upsertingState, fetchingState } = useMenuItems();
	const [t] = useCoreTranslation();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath, [
			{
				name: "Menu's",
				target: generatePath(MODULE_PATHS.site.overview, { siteId }),
			},
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
		menuItemsFacade.setMenuItem(generateEmptyMenuItem());
		menuItemsFacade.setMenuItemDraft(generateEmptyMenuItem());
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
	const pageTitle = `Menu-item ${t(CORE_TRANSLATIONS.ROUTING_CREATE)}`;

	const renderChildRoutes = (): ReactElement => (
		<RenderChildRoutes
			routes={route.routes}
			extraOptions={{
				loading: isLoading,
				onCancel: () => navigate(MODULE_PATHS.overview),
				onSubmit: createItem,
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
			<div className="u-margin-top">{renderChildRoutes()}</div>
		</>
	);
};

export default MenuItemCreate;
