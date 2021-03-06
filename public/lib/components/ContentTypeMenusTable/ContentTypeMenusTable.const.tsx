import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip, TooltipTypeMap } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import { MenusRowData } from './ContentTypeMenusTable.types';

export const MENUS_COLUMNS = (
	t: TranslateFunc,
	tModule: TranslateFunc
): TableColumn<MenusRowData>[] => [
	{
		label: tModule(MODULE_TRANSLATIONS.TABLE_MENU),
		value: 'label',
		component(name: string, { description }) {
			return (
				<div>
					<p>
						<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
							{name}
						</EllipsisWithTooltip>
					</p>
					<p className="u-text-light">
						<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
							{description}
						</EllipsisWithTooltip>
					</p>
				</div>
			);
		},
	},
	{
		label: '',
		disableSorting: true,
		classList: ['u-text-right'],
		component(value, { id, active, activateMenu, deactivateMenu }) {
			if (active) {
				return (
					<Button
						onClick={() => {
							deactivateMenu(id);
						}}
						type="danger"
						outline
					>
						{t(CORE_TRANSLATIONS.BUTTON_DEACTIVATE)}
					</Button>
				);
			}

			return (
				<Button
					onClick={() => {
						activateMenu(id);
					}}
					type="success"
					outline
				>
					{t(CORE_TRANSLATIONS.BUTTON_ACTIVATE)}
				</Button>
			);
		},
	},
];
