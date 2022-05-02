import { Table } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, DataLoader, LoadingState, useNavigate } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NAV_STATUSES } from '../../../components';
import { RearrangeModal } from '../../../components/RearrangeModal';
import rolesRightsConnector from '../../../connectors/rolesRights';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { getSiteStructureItemPath } from '../../../helpers';
import { extractSiblings } from '../../../helpers/extractSiblings';
import { useSiteStructureItems } from '../../../hooks';
import { ALERT_CONTAINER_IDS, SITES_ROOT } from '../../../navigation.const';
import {
	NavigationMatchProps,
	NavItemType,
	RearrangeNavItem,
	SiteStructureDetailRouteProps,
} from '../../../navigation.types';
import { SiteStructureItem } from '../../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../../store/siteStructureItems';

import { SITE_STRUCTURE_ITEMS_COLUMNS } from './SiteStructureItemsOverview.const';
import { SiteStructureItemsTableRow } from './SiteStructureItemsOverview.types';

const SiteStructureItemsOverview: FC<SiteStructureDetailRouteProps<NavigationMatchProps>> = () => {
	const [t] = translationsConnector.useCoreTranslation();
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
	const { siteId, siteStructureId } = useParams<{ siteStructureId?: string; siteId: string }>();
	const {
		siteStructureItems,
		fetchingState: siteStructureItemsLoadingState,
		upsertingState: siteStructureItemsUpsertingState,
	} = useSiteStructureItems();
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
	const [sortRows, setSortRows] = useState<SiteStructureItem[]>([]);

	useEffect(() => {
		if (
			siteStructureItemsLoadingState !== LoadingState.Loading &&
			mySecurityRightsLoadingState !== LoadingState.Loading
		) {
			return setInitialLoading(LoadingState.Loaded);
		}

		setInitialLoading(LoadingState.Loading);
	}, [mySecurityRightsLoadingState, siteStructureItemsLoadingState]);

	const transformItemsToRows = (
		siteStructureItems: SiteStructureItem[]
	): SiteStructureItemsTableRow[] => {
		return (siteStructureItems || []).map(siteStructureItem => {
			const siteStructureItemType =
				siteStructureItem.properties?.type ?? NavItemType.internal;
			const url =
				siteStructureItem.externalUrl?.slice(-1) === '/'
					? siteStructureItem.externalUrl.slice(
							0,
							siteStructureItem.externalUrl.length - 1
					  )
					: siteStructureItem.externalUrl;

			return {
				id: siteStructureItem.id as number,
				label: siteStructureItem.label,
				url: `${url}/${siteStructureItem.slug}`,
				siteUrl: url,
				type: siteStructureItemType,
				active: siteStructureItem.publishStatus === NAV_STATUSES.PUBLISHED,
				rows: transformItemsToRows(siteStructureItem.items),
				hasChildren:
					!!(siteStructureItem.parents || []).length ||
					(siteStructureItem.childItemCount || 0) > 0,
				navigate: (siteStructureItemId: number) => {
					const siteStructureItemDetailPath = getSiteStructureItemPath(
						siteStructureItemType
					);

					navigate(siteStructureItemDetailPath, {
						siteId,
						siteStructureId,
						siteStructureItemId,
					});
				},
			};
		});
	};

	const rows = useMemo(() => {
		if (!siteStructureItems || !siteStructureItems.length) {
			return [];
		}

		setNestedLoadingId(undefined);

		return transformItemsToRows(siteStructureItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteStructureId, siteStructureItems, siteId]);

	useEffect(() => {
		if (!siteId || !siteStructureId) {
			return;
		}

		siteStructureItemsFacade.getSubset(siteId, siteStructureId, 0, 1);
	}, [siteId, siteStructureId]);

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
			await siteStructureItemsFacade.getSubset(siteId, siteStructureId as string, rowId, 1);
		}

		setCachedItems([...cachedItems, rowId]);

		setExpandedRows({
			...expandedRows,
			[rowId]: true,
		});
	};

	const openRearrangeModal = (rowId: number): void => {
		setShowRearrange(true);
		setSortRows(extractSiblings(rowId, siteStructureItems as SiteStructureItem[]));
	};

	const onRearrange = async (items: RearrangeNavItem[]): Promise<void> => {
		await siteStructureItemsFacade.rearrangeItems(
			siteId,
			siteStructureId as string,
			items,
			ALERT_CONTAINER_IDS.siteStructureItemsOverview
		);
		setShowRearrange(false);
	};

	const renderTable = (): ReactElement => {
		return (
			<Table
				fixed
				dataKey="id"
				columns={SITE_STRUCTURE_ITEMS_COLUMNS(
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
				loading={
					siteStructureItemsLoadingState === LoadingState.Loading && !nestedLoadingId
				}
			/>
		);
	};

	return (
		<>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.siteStructureItemsOverview} />
			</div>
			<DataLoader
				loadingState={initialLoading === LoadingState.Loading && !nestedLoadingId}
				render={renderTable}
			/>
			<RearrangeModal
				items={sortRows}
				show={showRearrange}
				loading={siteStructureItemsUpsertingState === LoadingState.Loading}
				onCancel={() => setShowRearrange(false)}
				onConfirm={onRearrange}
			/>
		</>
	);
};

export default SiteStructureItemsOverview;
