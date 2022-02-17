import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	DataLoader,
	FilterItem,
	LoadingState,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { FilterForm, FilterFormState } from '../../components';
import sitesConnector from '../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenus } from '../../hooks/useMenus';
import { MenuMatchProps, MenuRouteProps } from '../../menu.types';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../navigation.const';
import { menusFacade } from '../../store/menus';

import {
	DEFAULT_FILTER_FORM,
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	OVERVIEW_COLUMNS,
} from './MenuOverview.const';
import { OverviewTableRow } from './MenuOverview.types';

const MenuOverview: FC<MenuRouteProps<MenuMatchProps>> = ({ match }) => {
	const { siteId } = match.params;
	/**
	 * Hooks
	 */

	const [initialLoading, setInitialLoading] = useState(LoadingState.Loaded);
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(DEFAULT_FILTER_FORM);
	const [query, setQuery] = useAPIQueryParams(DEFAULT_OVERVIEW_QUERY_PARAMS);
	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);
	const [site] = sitesConnector.hooks.useSite(siteId);

	const [loadingsState, menus, menuPaging] = useMenus();
	const isLoading = useMemo(() => {
		return loadingsState === LoadingState.Loading;
	}, [loadingsState]);

	useEffect(() => {
		if (loadingsState !== LoadingState.Loading) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [loadingsState]);

	useEffect(() => {
		if (!siteId || !site?.data.name) {
			return;
		}

		menusFacade.getMenus(siteId, site?.data.name);
	}, [site, siteId]);

	/**
	 * Methods
	 */

	const createFilters = (values: FilterFormState): FilterItem[] => {
		return [
			{
				key: 'label',
				valuePrefix: 'Zoekterm',
				value: values.label,
			},
		].filter(f => !!f.value);
	};

	const clearAllFilters = (): void => {
		setQuery({ label: '' });
		setFilterFormState(DEFAULT_FILTER_FORM);
	};

	const clearFilter = (item: FilterItem): void => {
		setQuery({ [item.key as string]: '' });
		setFilterFormState({
			...filterFormState,
			[item.key as string]: '',
		});
	};

	const onOrderBy = (orderBy: OrderBy): void => {
		setQuery({ sort: parseOrderByToString(orderBy) });
	};

	const onApplyFilters = (values: FilterFormState): void => {
		setFilterFormState(values);
		setQuery(values);
	};

	const activeSorting = parseStringToOrderBy(query.sort ?? '');
	const activeFilters = createFilters(filterFormState);

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		if (!Array.isArray(menus)) {
			return null;
		}
		const customMenuRows: OverviewTableRow[] = menus.map(menu => ({
			id: menu.id?.toString() || '',
			label: menu.label || undefined,
			description: menu.description || undefined,
			lang: 'NL',
			navigate: (id: string) => navigate(MODULE_PATHS.site.detailSettings, { siteId, id }),
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={filterFormState}
						onCancel={clearAllFilters}
						onSubmit={onApplyFilters}
						clearActiveFilter={clearFilter}
						activeFilters={activeFilters}
					/>
				</div>
				<PaginatedTable
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--xs"
					columns={OVERVIEW_COLUMNS(t)}
					rows={customMenuRows}
					orderBy={onOrderBy}
					activeSorting={activeSorting}
					totalValues={menuPaging?.totalElements || 0}
					loading={isLoading}
					loadDataMessage="Menu's ophalen"
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Menu">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button
						iconLeft="plus"
						onClick={() => navigate(MODULE_PATHS.site.create, { siteId })}
					>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<AlertContainer containerId={'menu-overview'} />
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default MenuOverview;