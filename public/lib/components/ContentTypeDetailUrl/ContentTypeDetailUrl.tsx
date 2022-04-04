import { TextField } from '@acpaas-ui/react-components';
import { LanguageHeaderContext, Table } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import { FormikMultilanguageField, useSiteContext } from '@redactie/utils';
import { resolveUrl } from '@wcm/pattern-resolver';
import { FormikValues, useFormikContext } from 'formik';
import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';

import SitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import { PATTERN_COLUMNS, PATTERN_PLACEHOLDERS } from './ContentTypeDetailUrl.const';
import { PatternRowData } from './ContentTypeDetailUrl.types';

function placeholderToKeyValue(placeholders: PatternRowData[]): { [key: string]: string } {
	return placeholders.reduce((acc: any, { key: placeholder, example: value }) => {
		const valueWithoutBrackets = placeholder.replace(/\[|\]/g, '');
		const parent = valueWithoutBrackets?.split(':')[0] ?? '';
		const key = valueWithoutBrackets?.split(':')[1];

		if (key) {
			acc[parent] = { ...acc[parent], [key]: value };
		}

		return acc;
	}, {});
}

const ContentTypeDetailUrl: FC<ExternalTabProps> = () => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [cursorPosition, setCursorPosition] = useState<number | null>(null);
	const { setFieldValue, values } = useFormikContext<FormikValues>();
	const { siteId } = useSiteContext();
	const { activeLanguage } = useContext(LanguageHeaderContext);
	const [resolvedPattern, setResolvedPattern] = useState<string>('');
	const placeholders = PATTERN_PLACEHOLDERS(tModule, !!siteId);
	const [site] = SitesConnector.hooks.useSite(siteId);

	const urlResolver = placeholderToKeyValue(placeholders);

	let preUrl = 'https://www.antwerpen.be';

	if (site) {
		preUrl = site.data.url[activeLanguage] || site.data.url;
	}

	useEffect(() => {
		async function getResolvedPattern(): Promise<void> {
			const resolvedUrl = await resolveUrl(values?.url?.urlPattern?.nl ?? '', urlResolver);
			setResolvedPattern(resolvedUrl);
		}

		getResolvedPattern();
	}, [urlResolver, values]);

	const handleBlur = (event: ChangeEvent<HTMLInputElement>): void => {
		setCursorPosition(event.target.selectionStart);
	};

	const importPattern = (key: string): void => {
		// TODO: Implement multilanguage
		const urlPattern = values.url.urlPattern.nl;

		if (!cursorPosition) {
			setFieldValue(`url.urlPattern.${activeLanguage.key}`, `${urlPattern}${key}`);
			return;
		}

		const left = urlPattern.substring(0, cursorPosition);
		const right = urlPattern.substring(cursorPosition);
		setFieldValue(`url.urlPattern.${activeLanguage.key}`, `${left}${key}${right}`);
		setCursorPosition(null);
	};

	return (
		<div>
			<div className="u-margin-bottom">
				<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_URL_DESCRIPTION)}</p>
			</div>
			<FormikMultilanguageField
				asComponent={TextField}
				label="Patroon"
				name="url.urlPattern"
				placeholder="Geef een url patroon op"
				onBlur={handleBlur}
			/>
			{resolvedPattern && (
				<div className="u-bg-light u-padding-left u-padding-right u-padding-bottom">
					<p>Voorbeeld</p>
					<span>
						{preUrl}/<strong>{resolvedPattern}</strong>
					</span>
				</div>
			)}
			<Table
				fixed
				className="u-margin-top"
				columns={PATTERN_COLUMNS(t, tModule, importPattern)}
				rows={placeholders}
			/>
		</div>
	);
};

export default ContentTypeDetailUrl;
