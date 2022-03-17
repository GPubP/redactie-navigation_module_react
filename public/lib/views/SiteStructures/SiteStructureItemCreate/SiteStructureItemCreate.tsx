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
import { generateEmptyNavItem } from '../../../helpers';
import {
	useSiteStructure,
	useSiteStructureItem,
	useSiteStructureItemDraft,
	useSiteStructureItems,
} from '../../../hooks';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	MODULE_PATHS,
	SITES_ROOT,
} from '../../../navigation.const';
import { NavigationModuleProps, SiteStructureItemMatchProps } from '../../../navigation.types';
import {
	SiteStructureItemModel,
	siteStructureItemsFacade,
} from '../../../store/siteStructureItems';

const SiteStructureItemCreate: FC<NavigationModuleProps<SiteStructureItemMatchProps>> = ({
	route,
	match,
}) => {
	const { siteId, siteStructureId } = match.params;

	/**
	 * Hooks
	 */
	const { siteStructureItem } = useSiteStructureItem();
	const [siteStructureItemDraft] = useSiteStructureItemDraft();
	const { siteStructure } = useSiteStructure();
	const { navigate, generatePath } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const { upsertingState, fetchingState } = useSiteStructureItems();
	const [t] = translationsConnector.useCoreTranslation();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath, [
			{
				name: 'Sitestructuren',
				target: generatePath(MODULE_PATHS.site.siteStructuresOverview, { siteId }),
			},
			...(siteStructure?.label
				? [
						{
							name: siteStructure?.label,
							target: generatePath(MODULE_PATHS.site.siteStructureItems, {
								siteId,
								siteStructureId,
							}),
						},
				  ]
				: []),
		])
	);
	const isLoading = useMemo(() => {
		return upsertingState === LoadingState.Loading || fetchingState === LoadingState.Loading;
	}, [fetchingState, upsertingState]);

	const [forceNavigateToOverview] = useOnNextRender(() =>
		navigate(MODULE_PATHS.site.siteStructureItems, {
			siteId,
			siteStructureId,
		})
	);

	useEffect(() => {
		siteStructureItemsFacade.setSiteStructureItem(generateEmptyNavItem());
		siteStructureItemsFacade.setSiteStructureItemDraft(generateEmptyNavItem());
	}, []);

	/**
	 * Methods
	 */
	const createItem = (payload: SiteStructureItemModel): void => {
		siteStructureItemsFacade
			.createSiteStructureItem(
				siteId,
				siteStructureId,
				payload,
				ALERT_CONTAINER_IDS.siteStructureItemsOverview
			)
			.then(response => {
				if (response && response.id) {
					forceNavigateToOverview();
				}
			});
	};

	/**
	 * Render
	 */
	const pageTitle = `Sitestrucuur item ${t(CORE_TRANSLATIONS.ROUTING_CREATE)}`;

	const renderChildRoutes = (): ReactElement => (
		<RenderChildRoutes
			routes={route.routes}
			extraOptions={{
				loading: isLoading,
				onCancel: () => navigate(MODULE_PATHS.overview),
				onSubmit: createItem,
				siteStructure,
				siteStructureItem,
				siteStructureItemDraft,
			}}
		/>
	);

	return (
		<>
			<ContextHeader
				title={pageTitle}
				badges={[
					{
						name: 'Sitestructuur-item',
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

export default SiteStructureItemCreate;