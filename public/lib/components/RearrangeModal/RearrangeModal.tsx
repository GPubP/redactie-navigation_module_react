import { Button } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
	Table,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { menuItemsFacade } from '../../store/menuItems/menuItems.facade';

import { REARRANGE_MENU_ITEMS_COLUMNS } from './MenuItemsRearangeOverview.const';

export const RearrangeModal: FC<{
	show?: boolean;
	selectedId: number | undefined;
	onCancel?: () => void;
	onConfirm?: () => void;
}> = ({ show = false, selectedId, onCancel, onConfirm }) => {
	const [internalShow, setInternalShow] = useState<boolean>(show);
	const [t] = useCoreTranslation();
	const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});
	//const { siteId, menuId } = useParams<{ menuId?: string; siteId: string }>();

	const onInternalCancel = (): void => {
		setInternalShow(false);
		onCancel && onCancel();
	};

	const onRowExpand = async (rowId: number): Promise<void> => {
		if (expandedRows[rowId]) {
			delete expandedRows[rowId];
			setExpandedRows({ ...expandedRows });
			return;
		}

		//await menuItemsFacade.getSubset(siteId, menuId as string, rowId, 1);

		setExpandedRows({
			...expandedRows,
			[rowId]: true,
		});
	};

	const openRows = useMemo(() => {
		return Object.keys(expandedRows).filter(rowId => expandedRows[rowId]);
	}, [expandedRows]);

	useEffect(() => {
		setInternalShow(show);
	}, [show]);

	return (
		<ControlledModal show={internalShow} onClose={onInternalCancel} size="xlarge">
			<ControlledModalHeader>
				<h4>Menu-items sorteren.{selectedId}</h4>
			</ControlledModalHeader>
			<ControlledModalBody>
				<Table
					dataKey="id"
					columns={REARRANGE_MENU_ITEMS_COLUMNS(t, onRowExpand, openRows)}
					rows={[]}
					nestedLoadingId={0}
					expandedRows={expandedRows}
					expandNested={false}
					striped={false}
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
				/>
			</ControlledModalBody>
			<ControlledModalFooter>
				<div className="u-flex u-flex-item u-flex-justify-end">
					<Button onClick={onInternalCancel} negative>
						Annuleer
					</Button>
					<Button onClick={onConfirm} type={'success'}>
						Bewaar
					</Button>
				</div>
			</ControlledModalFooter>
		</ControlledModal>
	);
};
