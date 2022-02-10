import { ContextHeader, ContextHeaderTopSection } from '@acpaas-ui/react-editorial-components';
import {
	ContextHeaderTab,
	DataLoader,
	LoadingState,
	RenderChildRoutes,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { MODULE_PATHS, BREADCRUMB_OPTIONS, SITES_ROOT } from '../../navigation.const';
import { MenuModuleProps, MenuMatchProps } from '../../menu.types';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';

const MenuCreate: FC<MenuModuleProps<MenuMatchProps>> = ({ tenantId, route, match }) => {
	const { siteId } = match.params;

	/**
	 * Hooks
	 */
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loaded);
	const [t] = useCoreTranslation();
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		navigate(`${MODULE_PATHS.root}`, { siteId });
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
				loading: false,
				isCreating: true,
				onCancel: navigateToOverview,
				onSubmit: (sectionData: any, tab: ContextHeaderTab) =>
					console.log({ sectionData, tab }),
			}}
		/>
	);

	return (
		<>
			<ContextHeader
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
