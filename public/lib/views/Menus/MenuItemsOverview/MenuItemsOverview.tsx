import { Table } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, DataLoader, LoadingState, useNavigate } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NAV_STATUSES } from '../../../components';
import { RearrangeModal } from '../../../components/RearrangeModal';
import rolesRightsConnector from '../../../connectors/rolesRights';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { getMenuItemPath, getMenuItemTypeByValue } from '../../../helpers';
import { extractSiblings } from '../../../helpers/extractSiblings';
import { useMenuItems } from '../../../hooks';
import { ALERT_CONTAINER_IDS, SITES_ROOT } from '../../../navigation.const';
import {
	MenuDetailRouteProps,
	NavigationMatchProps,
	NavItemType,
	RearrangeNavItem,
} from '../../../navigation.types';
import { MenuItem } from '../../../services/menuItems';
import { menuItemsFacade } from '../../../store/menuItems';

import { MENU_ITEMS_COLUMNS } from './MenuItemsOverview.const';
import { MenuItemsTableRow } from './MenuItemsOverview.types';

const MenuItemsOverview: FC<MenuDetailRouteProps<NavigationMatchProps>> = () => {
	const [t] = translationsConnector.useCoreTranslation();
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
	const { siteId, menuId } = useParams<{ menuId?: string; siteId: string }>();
	const {
		menuItems,
		fetchingState: menuItemsLoadingState,
		upsertingState: menuItemsUpsertingState,
	} = useMenuItems();
	const { navigate } = useNavigate(SITES_ROOT);
	const [nestedLoadingId, setNestedLoadingId] = useState<number | undefined>();
	const [
		mySecurityRightsLoadingState,
		mySecurityrights,
	] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [cachedItems, setCachedItems] = useState<number[]>([]);
	const [showRearrange, setShowRearrange] = useState(false);
	const [sortRows, setSortRows] = useState<MenuItem[]>([]);

	useEffect(() => {
		if (
			menuItemsLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [menuItemsLoadingState, mySecurityRightsLoadingState]);

	const transformItemsToRows = (menuItems: MenuItem[]): MenuItemsTableRow[] => {
		return (menuItems || []).map(menuItem => {
			return {
				id: menuItem.id as number,
				label: menuItem.label,
				url: menuItem.externalUrl,
				active: menuItem.publishStatus === NAV_STATUSES.PUBLISHED,
				rows: transformItemsToRows(menuItem.items),
				hasChildren:
					!!(menuItem.parents || []).length || (menuItem.childItemCount || 0) > 0,
				navigate: (menuItemId: number) => {
					// TODO: change this once properties.type is available from items call
					const menuItemType = getMenuItemTypeByValue(menuItem);
					const menuItemDetailPath = getMenuItemPath(menuItemType);

					navigate(menuItemDetailPath, {
						siteId,
						menuId,
						menuItemId,
					});
				},
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

		if (!cachedItems.includes(rowId)) {
			setNestedLoadingId(rowId);
			await menuItemsFacade.getSubset(siteId, menuId as string, rowId, 1);
		}

		setCachedItems([...cachedItems, rowId]);

		setExpandedRows({
			...expandedRows,
			[rowId]: true,
		});
	};

	const openRearrangeModal = (rowId: number): void => {
		setShowRearrange(true);
		setSortRows(extractSiblings(rowId, menuItems as MenuItem[]));
	};

	const onRearrange = async (items: RearrangeNavItem[]): Promise<void> => {
		await menuItemsFacade.rearrangeItems(
			siteId,
			menuId as string,
			items,
			ALERT_CONTAINER_IDS.menuItemsOverview
		);
		setShowRearrange(false);
	};

	const renderTable = (): ReactElement => {
		return (
			<Table
				fixed
				dataKey="id"
				columns={MENU_ITEMS_COLUMNS(
					t,
					mySecurityrights,
					onRowExpand,
					openRearrangeModal,
					openRows
				)}
				rows={rows}
				nestedLoadingId={nestedLoadingId}
				expandedRows={expandedRows}
				expandNested={false}
				striped={false}
				noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
				loading={menuItemsLoadingState === LoadingState.Loading && !nestedLoadingId}
			/>
		);
	};

	return (
		<>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.menuItemsOverview} />
			</div>
			<DataLoader
				loadingState={initialLoading === LoadingState.Loading && !nestedLoadingId}
				render={renderTable}
			/>
			<RearrangeModal
				items={sortRows}
				show={showRearrange}
				loading={menuItemsUpsertingState === LoadingState.Loading}
				onCancel={() => setShowRearrange(false)}
				onConfirm={onRearrange}
			/>
		</>
	);
};

export default MenuItemsOverview;
