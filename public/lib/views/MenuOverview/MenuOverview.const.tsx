import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { FilterFormState } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors/translations';

import { OverviewTableRow } from './MenuOverview.types';

export const DEFAULT_OVERVIEW_QUERY_PARAMS = {
	label: {
		defaultValue: '',
		type: 'string',
	},
	quantity: {
		defaultValue: '',
		type: 'number',
	},
	lang: {
		defaultValue: '',
		type: 'string',
	},
} as const;

export const DEFAULT_FILTER_FORM: FilterFormState = {
	label: '',
};

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		width: '50%',
		component(label: string, { description, settingsPath }) {
			return (
				<>
					<Link to={settingsPath}>
						<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
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
		label: 'Aantal menu-items',
		value: 'quantity',
		width: '20%',
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
		component(value, { navigate }) {
			return <Button ariaLabel="Edit" icon="edit" onClick={navigate} transparent />;
		},
	},
];
