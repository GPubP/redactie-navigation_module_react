import { Table } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, DataLoader, LoadingState, useNavigate } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NAV_STATUSES } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenuItems } from '../../hooks';
import { MenuDetailRouteProps, MenuMatchProps } from '../../menu.types';
import { ALERT_CONTAINER_IDS, MODULE_PATHS, SITES_ROOT } from '../../navigation.const';
import { MenuItem } from '../../services/menuItems';
import { menuItemsFacade } from '../../store/menuItems';

import { MENU_ITEMS_COLUMNS } from './MenuItemsOverview.const';
import { MenuItemsTableRow } from './MenuItemsOverview.types';

const MenuItemsOverview: FC<MenuDetailRouteProps<MenuMatchProps>> = () => {
	const [t] = useCoreTranslation();
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
	const { siteId, menuId } = useParams<{ menuId?: string; siteId: string }>();
	const { menuItems, fetchingState: menuItemsLoadingState } = useMenuItems();
	const { navigate } = useNavigate(SITES_ROOT);
	const [nestedLoadingId, setNestedLoadingId] = useState<number | undefined>();

	const transformItemsToRows = (menuItems: MenuItem[]): MenuItemsTableRow[] => {
		return (menuItems || []).map(menuItem => {
			return {
				id: menuItem.id as number,
				label: menuItem.label,
				url: menuItem.externalUrl,
				active: menuItem.publishStatus === NAV_STATUSES.PUBLISHED,
				rows: transformItemsToRows(menuItem.items),
				parents: menuItem.parents || [],
				childItemCount: menuItem.childItemCount || 0,
				navigate: (menuItemId: number) =>
					navigate(MODULE_PATHS.site.menuItemDetailSettings, {
						siteId,
						menuId,
						menuItemId,
					}),
			};
		});
	};

	const rows = useMemo(() => {
		if (!menuItems || !menuItems.length) {
			return [];
		}

		setNestedLoadingId(undefined);

		return transformItemsToRows(menuItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menuId, menuItems, siteId]);

	useEffect(() => {
		if (!siteId || !menuId) {
			return;
		}

		menuItemsFacade.getSubset(siteId, menuId, 0, 0);
	}, [menuId, siteId]);

	const openRows = useMemo(() => {
		return Object.keys(expandedRows).filter(rowId => expandedRows[rowId]);
	}, [expandedRows]);

	const onRowExpand = async (rowId: number): Promise<void> => {
		if (expandedRows[rowId]) {
			delete expandedRows[rowId];
			setExpandedRows({ ...expandedRows });
			return;
		}

		setNestedLoadingId(rowId);
		await menuItemsFacade.getSubset(siteId, menuId as string, rowId, 1);

		setExpandedRows({
			...expandedRows,
			[rowId]: true,
		});
	};

	const openRearrangeModal = (rowId: string | number): void => {
		console.log(rowId);
	};

	const renderTable = (): ReactElement => {
		return (
			<Table
				fixed
				dataKey="id"
				columns={MENU_ITEMS_COLUMNS(t, onRowExpand, openRearrangeModal, openRows)}
				rows={rows}
				nestedLoadingId={nestedLoadingId}
				expandedRows={expandedRows}
				expandNested={false}
				striped={false}
				noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
			/>
		);
	};

	return (
		<>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.menuItemsOverview} />
			</div>
			<DataLoader
				loadingState={menuItemsLoadingState !== LoadingState.Loaded}
				render={renderTable}
			/>
		</>
	);
};

export default MenuItemsOverview;
