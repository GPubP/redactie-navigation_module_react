import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import {
	ContextHeaderTab,
	ContextHeaderTabLinkProps,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import rolesRightsConnector from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useActiveTabs, useMenu, useMenuDraft } from '../../hooks';
import { Menu } from '../../services/menus';
import {
	MODULE_PATHS,
	SITES_ROOT,
	MENU_DETAIL_TABS,
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
} from '../../navigation.const';
import { MenuRouteProps } from '../../menu.types';
import { menusFacade } from '../../store/menus';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';

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
				rolesRightsConnector.securityRights.update,
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
	const [menuDraft] = useMenuDraft();
	const activeTabs = useActiveTabs(MENU_DETAIL_TABS, location.pathname);

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
			menusFacade.getOccurrences(siteId, menuUuid)
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

	const update = (updatedMenu: Menu) => {
		if (!updatedMenu) {
			return Promise.resolve();
		}

		return menusFacade.updateMenu(siteId, updatedMenu, ALERT_CONTAINER_IDS.settings);
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
					routes: route.routes,
					loading: isLoading,
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
