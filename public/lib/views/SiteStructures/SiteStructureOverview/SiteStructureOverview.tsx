import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	DataLoader,
	LoadingState,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	SearchParams,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import sitesConnector from '../../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { useSiteStructures } from '../../../hooks/useSiteStructures';
import { BREADCRUMB_OPTIONS, MODULE_PATHS, SITES_ROOT } from '../../../navigation.const';
import { NavigationMatchProps, NavigationRouteProps } from '../../../navigation.types';
import { siteStructuresFacade } from '../../../store/siteStructures';

import {
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	DEFAULT_QUERY_PARAMS,
	OVERVIEW_COLUMNS,
} from './SiteStructureOverview.const';
import { OverviewTableRow } from './SiteStructureOverview.types';

const SiteStructureOverview: FC<NavigationRouteProps<NavigationMatchProps>> = ({ match }) => {
	const { siteId } = match.params;
	/**
	 * Hooks
	 */

	const [initialLoading, setInitialLoading] = useState(LoadingState.Loaded);
	const [query, setQuery] = useAPIQueryParams(DEFAULT_OVERVIEW_QUERY_PARAMS);
	const [t] = translationsConnector.useCoreTranslation();
	const { generatePath, navigate } = useNavigate(SITES_ROOT);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);
	const [site] = sitesConnector.hooks.useSite(siteId);

	const [loadingState, siteStructures, siteStructuresPaging] = useSiteStructures();

	const isLoading = useMemo(() => {
		return loadingState === LoadingState.Loading;
	}, [loadingState]);

	useEffect(() => {
		if (loadingState !== LoadingState.Loading) {
			return setInitialLoading(LoadingState.Loaded);
		}
	}, [loadingState]);

	useEffect(() => {
		if (!siteId || !site?.data.name) {
			return;
		}

		siteStructuresFacade.getSiteStructures(siteId, {
			...query,
			includeItemCount: true,
		} as SearchParams);
	}, [query, site, siteId]);

	/**
	 * Methods
	 */

	const onOrderBy = (orderBy: OrderBy): void => {
		setQuery({ sort: parseOrderByToString(orderBy) });
	};

	const handlePageChange = (pageNumber: number): void => {
		setQuery({
			page: pageNumber,
			pagesize: DEFAULT_QUERY_PARAMS.pagesize,
		});
	};

	const activeSorting = parseStringToOrderBy(query.sort ?? '');

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		if (!Array.isArray(siteStructures)) {
			return null;
		}
		const customSiteStructuresRows: OverviewTableRow[] = siteStructures.map(siteStructures => ({
			id: siteStructures.id?.toString() || '',
			label: siteStructures.label || undefined,
			description: siteStructures.description || undefined,
			itemCount: siteStructures.itemCount || 0,
			lang: siteStructures.lang || '',
			navigate: (siteStructureId: string) =>
				navigate(MODULE_PATHS.site.siteStructureItems, { siteId, siteStructureId }),
		}));

		return (
			<PaginatedTable
				fixed
				className="u-margin-top"
				tableClassName="a-table--fixed--xs"
				columns={OVERVIEW_COLUMNS(t)}
				rows={customSiteStructuresRows}
				currentPage={query.page}
				itemsPerPage={DEFAULT_QUERY_PARAMS.pagesize}
				onPageChange={handlePageChange}
				orderBy={onOrderBy}
				activeSorting={activeSorting}
				totalValues={siteStructuresPaging?.totalElements || 0}
				loading={isLoading}
				loadDataMessage="Sitestructuren ophalen"
				noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
			/>
		);
	};

	return (
		<>
			<ContextHeader title="Sitestructuren">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<AlertContainer containerId={'siteStructures-overview'} />
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default SiteStructureOverview;
