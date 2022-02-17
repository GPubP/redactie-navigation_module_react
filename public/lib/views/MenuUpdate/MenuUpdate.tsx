import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	ContextHeaderTabLinkProps,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useOnNextRender,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import rolesRightsConnector from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useActiveTabs, useMenu, useMenuDraft } from '../../hooks';
import { MenuRouteProps } from '../../menu.types';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MENU_DETAIL_TABS,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../navigation.const';
import { Menu } from '../../services/menus';
import { menusFacade } from '../../store/menus';

const MenuUpdate: FC<MenuRouteProps<{ menuUuid?: string; siteId: string }>> = ({
	location,
	route,
	tenantId,
}) => {
	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [t] = useCoreTranslation();
	const { siteId, menuUuid } = useParams<{ menuUuid?: string; siteId: string }>();
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
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
		fetchingState: menuLoadingState,
		upsertingState: upsertMenuLoadingState,
		removingState: removeMenuLoadingState,
		menu,
	} = useMenu();
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
			menuLoadingState === LoadingState.Loading ||
			upsertMenuLoadingState === LoadingState.Loading
		);
	}, [upsertMenuLoadingState, menuLoadingState]);
	const isRemoving = useMemo(() => {
		return removeMenuLoadingState === LoadingState.Loading;
	}, [removeMenuLoadingState]);
	const [menuDraft] = useMenuDraft();
	const activeTabs = useActiveTabs(MENU_DETAIL_TABS, location.pathname);
	const [forceNavigateToOverview] = useOnNextRender(() =>
		navigate(MODULE_PATHS.site.overview, { siteId })
	);

	useEffect(() => {
		if (
			menuLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [mySecurityRightsLoadingState, menuLoadingState]);

	useEffect(() => {
		if (menuLoadingState !== LoadingState.Loading && menu) {
			menusFacade.setMenuDraft(menu);
		}
	}, [siteId, menu, menuLoadingState]);

	useEffect(() => {
		if (menuUuid) {
			menusFacade.getMenu(siteId, menuUuid);
			menusFacade.getOccurrences(siteId, menuUuid);
		}

		return () => {
			menusFacade.unsetMenu();
			menusFacade.unsetMenuDraft();
		};
	}, [siteId, menuUuid]);

	/**
	 * Methods
	 */
	const onCancel = (): void => {
		if (!menu) {
			return;
		}

		menusFacade.setMenuDraft(menu);
	};

	const update = (updatedMenu: Menu): Promise<void> => {
		if (!updatedMenu) {
			return Promise.resolve();
		}

		return menusFacade.updateMenu(siteId, updatedMenu, ALERT_CONTAINER_IDS.settings);
	};

	const deleteMenu = async (menu: Menu): Promise<void> => {
		return (
			menusFacade
				.deleteMenu(siteId, menu)
				.then(forceNavigateToOverview)
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.catch(() => {})
		);
	};

	/**
	 * Render
	 */

	const pageTitle = `${menuDraft?.label ? `'${menuDraft?.label}'` : 'Menu'} ${t(
		CORE_TRANSLATIONS.ROUTING_UPDATE
	)}`;

	const renderChildRoutes = (): ReactElement | null => {
		if (!menuDraft) {
			return null;
		}

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={{
					tenantId,
				}}
				extraOptions={{
					onCancel,
					onSubmit: update,
					onDelete: deleteMenu,
					routes: route.routes,
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
				tabs={activeTabs}
				linkProps={(props: ContextHeaderTabLinkProps) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.site.detail}/${props.href}`, {
						siteId,
						menuUuid,
					}),
					component: Link,
				})}
				title={pageTitle}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
		</>
	);
};

export default MenuUpdate;
