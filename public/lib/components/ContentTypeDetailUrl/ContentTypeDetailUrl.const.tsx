import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import classNames from 'classnames/bind';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { NavigationSecurityRights } from '../../navigation.types';

import styles from './ContentTypeDetailUrl.module.scss';
import { PatternRowData } from './ContentTypeDetailUrl.types';

const cx = classNames.bind(styles);

export const PATTERN_PLACEHOLDERS = (
	tModule: TranslateFunc,
	includeSitePatterns = false,
	siteUrl?: string
): PatternRowData[] => [
	{
		key: '[item:slug]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_SLUG_DESCRIPTION),
		example: 'een-artikel',
	},
	{
		key: '[item:id]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_ID_DESCRIPTION),
		example: 'd73ec048-42d3-458f-98f4-5e47ad4e45c1',
	},
	{
		key: '[item:label]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_LABEL_DESCRIPTION),
		example: 'een-artikel',
	},
	{
		key: '[item:created]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_CREATED_DESCRIPTION),
		example: '2022-01-01',
	},
	{
		key: '[item:lang]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_LANG_DESCRIPTION),
		example: 'nl',
	},
	...(includeSitePatterns
		? [
				{
					key: '[item:nav:parents]',
					description: tModule(MODULE_TRANSLATIONS.PATTERN_NAV_DESCRIPTION),
					example: 'een-grootouder/een-ouder',
				},
		  ]
		: []),
	{
		key: '[site:url]',
		description: tModule(MODULE_TRANSLATIONS.PATTERN_URL_DESCRIPTION),
		example: siteUrl || 'https://www.antwerpen.be',
	},
	{
		key: '[content-type:label]',
		description: tModule(MODULE_TRANSLATIONS['PATTERN_CONTENT-TYPE_DESCRIPTION']),
		example: 'content-type',
	},
];

export const PATTERN_COLUMNS = (
	t: TranslateFunc,
	tModule: TranslateFunc,
	importPlaceholder: (key: string) => void,
	navigationRights: NavigationSecurityRights,
	siteId?: string
): TableColumn<PatternRowData>[] => {
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

	if (!navigationRights.updateUrlPattern && siteId) {
		return defaultColumns;
	}

	if (!navigationRights.updateTenantUrlPattern && !siteId) {
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
					// Button does not support onMouseUp. Needed to run before handleBlur fn from field.
					<div onMouseUp={() => importPlaceholder(key)} className={cx('u-inline-block')}>
						<Button
							ariaLabel="Import"
							icon="plus"
							type="primary"
							transparent
							size="small"
						/>
					</div>
				);
			},
		},
	];
};
