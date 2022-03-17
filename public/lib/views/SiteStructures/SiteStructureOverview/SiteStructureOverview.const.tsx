import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { FilterFormState } from '../../../components';
import { CORE_TRANSLATIONS } from '../../../connectors/translations';

import { OverviewTableRow } from './SiteStructureOverview.types';

export const DEFAULT_QUERY_PARAMS = {
	page: 1,
	pagesize: 10,
};

export const DEFAULT_OVERVIEW_QUERY_PARAMS = {
	page: {
		defaultValue: DEFAULT_QUERY_PARAMS.page,
		type: 'number',
	},
	pagesize: {
		defaultValue: DEFAULT_QUERY_PARAMS.pagesize,
		type: 'number',
	},
	label: {
		defaultValue: '',
		type: 'string',
	},
	lang: {
		defaultValue: '',
		type: 'string',
	},
	sort: {
		defaultValue: 'label',
		type: 'string',
	},
	direction: {
		defaultValue: 1,
		type: 'number',
	},
} as const;

export const DEFAULT_FILTER_FORM: FilterFormState = {
	label: '',
};

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		width: '35%',
		component(value: string, { description, id }) {
			return (
				<>
					<Link to={`${id}/instellingen`}>
						<EllipsisWithTooltip>{value}</EllipsisWithTooltip>
					</Link>
					<p className="small">
						{description ? (
							<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
						) : (
							<span className="u-text-italic">
								{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
							</span>
						)}
					</p>
				</>
			);
		},
	},
	{
		label: 'Aantal sitestructuur-items',
		value: 'itemCount',
		width: '35%',
		disableSorting: true,
	},
	{
		label: 'Taal',
		value: 'lang',
		width: '10%',
		disableSorting: true,
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '20%',
		component(value, { navigate, id }) {
			return <Button ariaLabel="Edit" icon="edit" onClick={() => navigate(id)} transparent />;
		},
	},
];
