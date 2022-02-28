import { Table } from '@acpaas-ui/react-editorial-components';
import React, { FC, useMemo, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { MenuDetailRouteProps, MenuMatchProps } from '../../menu.types';

import { MENU_ITEMS_COLUMNS, MENU_ITEMS_MOCK_NESTED_ROWS } from './MenuItems.const';

const MenuItems: FC<MenuDetailRouteProps<MenuMatchProps>> = () => {
	const [t] = useCoreTranslation();
	const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});
	const [nestedLoadingId, setNestedLoadingId] = useState();

	const onRowExpand = (rowId: string | number): void => {
		if (expandedRows[rowId]) {
			delete expandedRows[rowId];
			setExpandedRows({ ...expandedRows });
			return;
		}

		setExpandedRows({
			...expandedRows,
			[rowId]: true,
		});
	};

	const openRows = useMemo(() => {
		return Object.keys(expandedRows).filter(rowId => expandedRows[rowId]);
	}, [expandedRows]);

	const openRearrangeModal = (rowId: string | number): void => {
		console.log(rowId);
	};

	return (
		<Table
			fixed
			dataKey="id"
			columns={MENU_ITEMS_COLUMNS(onRowExpand, openRearrangeModal, openRows)}
			rows={MENU_ITEMS_MOCK_NESTED_ROWS}
			nestedLoadingId={nestedLoadingId}
			expandedRows={expandedRows}
			expandNested={false}
			striped={false}
			noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-ITEMS'])}
		/>
	);
};

export default MenuItems;
