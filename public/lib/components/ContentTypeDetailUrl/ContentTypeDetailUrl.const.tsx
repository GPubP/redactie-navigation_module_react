import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import { PatternRowData } from './ContentTypeDetailUrl.types';

export const PATTERN_PLACEHOLDERS = (tModule: TranslateFunc): PatternRowData[] => [
	{
		key: '[item:id]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_ID_DESCRIPTION),
		example: '17389b47-8870-4ac5-91d7-292d9998b650',
	},
	{
		key: '[item:lang]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_LANG_DESCRIPTION),
		example: 'nl',
	},
	{
		key: '[item:slug]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_SLUG_DESCRIPTION),
		example: 'een-artikel',
	},
	{
		key: '[item:created]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_CREATED_DESCRIPTION),
		example: '2022-01-01',
	},
	{
		key: '[site:url]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_URL_DESCRIPTION),
		example: '2022-01-01',
	},
	{
		key: '[content-type:label]',
		description: tModule(MODULE_TRANSLATIONS['PATTERN_CONTENT-TYPE_DESCRIPTION']),
		example: '2022-01-01',
	},
];

export const PATTERN_COLUMNS = (
	t: TranslateFunc,
	tModule: TranslateFunc,
	importPlaceholder: (key: string) => void
): TableColumn<PatternRowData>[] => [
	{
		label: tModule(MODULE_TRANSLATIONS.VARIABLE),
		value: 'key',
		disableSorting: true,
		ellipsis: true,
		width: '20%',
	},
	{
		label: t(CORE_TRANSLATIONS.DESCRIPTION),
		value: 'description',
		ellipsis: true,
		disableSorting: true,
	},
	{
		label: t(CORE_TRANSLATIONS.EXAMPLE),
		value: 'example',
		ellipsis: true,
		disableSorting: true,
		width: '15%',
	},
	{
		label: '',
		disableSorting: true,
		classList: ['is-condensed', 'u-text-right'],
		width: '10%',
		component(value, { key }) {
			return (
				<Button
					ariaLabel="Import"
					icon="plus"
					onClick={() => importPlaceholder(key)}
					type="primary"
					transparent
					size="small"
				/>
			);
		},
	},
];
