import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';

import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import { MenuItemRowData } from './ContentDetailMenuCompartment.types';

export const MENU_COLUMNS = (tModule: TranslateFunc): TableColumn<MenuItemRowData>[] => [
	{
		label: tModule(MODULE_TRANSLATIONS['TABLE_LABEL']),
		value: 'label',
		disableSorting: true,
	},
	{
		label: tModule(MODULE_TRANSLATIONS['TABLE_MENU']),
		value: 'menu',
		disableSorting: true,
	},
	{
		label: tModule(MODULE_TRANSLATIONS['TABLE_POSITION']),
		value: 'position',
		disableSorting: true,
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '20%',
		component(value, { id, editMenuItem, menuId }) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => editMenuItem(id, menuId)}
					type="primary"
					transparent
				/>
			);
		},
	},
];
