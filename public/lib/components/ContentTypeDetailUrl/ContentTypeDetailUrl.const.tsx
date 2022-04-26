import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn, useSiteContext } from '@redactie/utils';
import classNames from 'classnames/bind';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { useNavigationRights } from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import styles from './ContentTypeDetailUrl.module.scss';
import { PatternRowData } from './ContentTypeDetailUrl.types';

const cx = classNames.bind(styles);

export const PATTERN_PLACEHOLDERS = (
	tModule: TranslateFunc,
	includeSitePatterns = false
): PatternRowData[] => [
	{
		key: '[item:id]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_ID_DESCRIPTION),
		example: '17389b47-8870-4ac5-91d7-292d9998b650',
	},
	{
		key: '[item:label]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_LABEL_DESCRIPTION),
		example: 'nl',
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
	...(includeSitePatterns
		? [
				{
					key: '[item:nav:parents]',
					description: tModule(MODULE_TRANSLATIONS.PATTERN_NAV_DESCRIPTION),
					example: 'een-grootouder/een-ouder',
				},
				{
					key: '[item:menu:parents]',
					description: tModule(MODULE_TRANSLATIONS.PATTERN_MENU_DESCRIPTION),
					example: 'een-grootouder/een-ouder',
				},
		  ]
		: []),
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
): TableColumn<PatternRowData>[] => {
	const { siteId } = useSiteContext();
	const navigationRights = useNavigationRights(siteId);

	const defaultColumns: TableColumn<PatternRowData>[] = [
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
			disableSorting: true,
			classList: [cx('u-wrap-normal')],
			width: '40%',
		},
		{
			label: t(CORE_TRANSLATIONS.EXAMPLE),
			value: 'example',
			ellipsis: true,
			disableSorting: true,
			width: '25%',
		},
	];
	if (!navigationRights.updateUrlPattern) {
		return defaultColumns;
	}

	return [
		...defaultColumns,
		{
			label: '',
			disableSorting: true,
			classList: ['is-condensed', 'u-text-right'],
			width: '5%',
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
};
