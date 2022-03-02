import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useOnNextRender,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import rolesRightsConnector from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenuItem, useMenuItemDraft } from '../../hooks';
import { MenuItemMatchProps, MenuModuleProps } from '../../menu.types';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../navigation.const';
import { MenuItem } from '../../services/menuItems';
import { menuItemsFacade } from '../../store/menuItems';

const MenuItemUpdate: FC<MenuModuleProps<MenuItemMatchProps>> = ({ route, match }) => {
	const { siteId, menuId, menuItemId } = match.params;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
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
	const {
		fetchingState: menuItemLoadingState,
		upsertingState: upsertMenuItemLoadingState,
		removingState: removeMenuItemLoadingState,
		menuItem,
	} = useMenuItem();
	const [menuItemDraft] = useMenuItemDraft();
	const [forceNavigateToOverview] = useOnNextRender(() =>
		navigate(MODULE_PATHS.site.detail, { siteId, menuId })
	);

	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});
	const rights = useMemo(
		() => ({
			canUpdate: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.menuSecurityRights.update,
			]),
			canDelete: rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
				rolesRightsConnector.menuSecurityRights.delete,
			]),
		}),
		[mySecurityrights]
	);
	const isLoading = useMemo(() => {
		return (
			menuItemLoadingState === LoadingState.Loading ||
			upsertMenuItemLoadingState === LoadingState.Loading
		);
	}, [menuItemLoadingState, upsertMenuItemLoadingState]);
	const isRemoving = useMemo(() => {
		return removeMenuItemLoadingState === LoadingState.Loading;
	}, [removeMenuItemLoadingState]);

	useEffect(() => {
		if (
			menuItemLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [mySecurityRightsLoadingState, menuItemLoadingState]);

	useEffect(() => {
		if (menuItemLoadingState !== LoadingState.Loading && menuItem) {
			menuItemsFacade.setMenuItemDraft(menuItem);
		}
	}, [siteId, menuItemLoadingState, menuItem]);

	useEffect(() => {
		if (menuItemId) {
			menuItemsFacade.getMenuItem(siteId, menuId, menuItemId);
		}

		return () => {
			menuItemsFacade.unsetMenuItem();
			menuItemsFacade.unsetMenuItemDraft();
		};
	}, [siteId, menuId, menuItemId]);

	/**
	 * Methods
	 */

	const update = (updatedMenuItem: MenuItem): Promise<void> => {
		if (!updatedMenuItem) {
			return Promise.resolve();
		}

		return menuItemsFacade.updateMenuItem(
			siteId,
			menuId,
			updatedMenuItem,
			ALERT_CONTAINER_IDS.settings
		);
	};

	const deleteMenuItem = async (menuItem: MenuItem): Promise<void> => {
		return (
			menuItemsFacade
				.deleteMenuItem(siteId, menuId, menuItem)
				.then(forceNavigateToOverview)
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.catch(() => {})
		);
	};

	/**
	 * Render
	 */
	const pageTitle = `${menuItemDraft?.label ? `'${menuItemDraft?.label}'` : 'Menu-item'} ${t(
		CORE_TRANSLATIONS.ROUTING_UPDATE
	)}`;

	const renderChildRoutes = (): ReactElement | null => {
		if (!menuItemDraft) {
			return null;
		}

		return (
			<RenderChildRoutes
				routes={route.routes}
				extraOptions={{
					onSubmit: update,
					onDelete: deleteMenuItem,
					loading: isLoading,
					removing: isRemoving,
					rights,
				}}
			/>
		);
	};

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
			<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
		</>
	);
};

export default MenuItemUpdate;
