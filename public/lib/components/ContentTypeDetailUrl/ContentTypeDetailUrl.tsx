import { TextField } from '@acpaas-ui/react-components';
import { LanguageHeaderContext, Table } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import { FormikMultilanguageField, useSiteContext } from '@redactie/utils';
import { resolveUrl } from '@wcm/pattern-resolver';
import { FormikValues, useFormikContext } from 'formik';
import { pathOr } from 'ramda';
import React, { ChangeEvent, FC, useContext, useEffect, useMemo, useState } from 'react';

import SitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { placeholderToKeyValue } from '../../helpers/placeholderToKeyValue';
import { useNavigationRights } from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { NavSiteCompartments } from '../ContentTypeSiteDetailTab/ContentTypeSiteDetailTab.const';

import {
	DEFAULT_BASE_URL,
	PATTERN_COLUMNS,
	PATTERN_PLACEHOLDERS,
} from './ContentTypeDetailUrl.const';

const ContentTypeDetailUrl: FC<ExternalTabProps & {
	setActiveCompartment: React.Dispatch<React.SetStateAction<NavSiteCompartments>>;
}> = ({ setActiveCompartment }) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [cursorPosition, setCursorPosition] = useState<number | null>(null);
	const { setFieldValue, values, errors, handleBlur } = useFormikContext<FormikValues>();
	const { siteId } = useSiteContext();
	const { activeLanguage } = useContext(LanguageHeaderContext);
	const [resolvedPattern, setResolvedPattern] = useState<string>('');
	const [site] = SitesConnector.hooks.useSite(siteId);

	const placeholders = PATTERN_PLACEHOLDERS(
		tModule,
		!!siteId,
		site?.data?.url?.[activeLanguage.key] || site?.data?.url
	);

	const urlResolver = placeholderToKeyValue(placeholders);
	const navigationRights = useNavigationRights(siteId);

	const preUrl = useMemo(() => {
		return site
			? pathOr(null, ['data', 'url', 'multiLanguage'], site)
				? site.data.url[activeLanguage.key]
				: typeof site.data.url === 'string'
				? site.data.url
				: DEFAULT_BASE_URL
			: DEFAULT_BASE_URL;
	}, [activeLanguage, site]);

	useEffect(() => {
		async function getResolvedPattern(): Promise<void> {
			const resolvedUrl = await resolveUrl(
				values?.url?.urlPattern?.[activeLanguage.key] ?? '',
				urlResolver
			);
			setResolvedPattern(resolvedUrl);
		}

		getResolvedPattern();
	}, [activeLanguage.key, urlResolver, values]);

	useEffect(() => {
		setActiveCompartment(NavSiteCompartments.url);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleBlurEvent = (event: ChangeEvent<HTMLInputElement>): void => {
		handleBlur(event);
		setCursorPosition(event.target.selectionStart);
	};

	const importPattern = (key: string): void => {
		const urlPattern = pathOr('', ['url', 'urlPattern', activeLanguage.key], values);

		if (!cursorPosition && cursorPosition !== 0) {
			return setFieldValue(
				`url.urlPattern.${activeLanguage.key}`,
				`${urlPattern.replace(/\/*$/, '')}/${key}`
			);
		}

		const left = urlPattern.substring(0, cursorPosition);
		const right = urlPattern.substring(cursorPosition);
		setFieldValue(
			`url.urlPattern.${activeLanguage.key}`,
			`${left.replace(/\/*$/, '')}/${key}${right}`
		);
		setCursorPosition(null);
	};

	return (
		<div>
			<div className="u-margin-bottom">
				<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_URL_DESCRIPTION)}</p>
			</div>
			<FormikMultilanguageField
				asComponent={TextField}
				disabled={siteId && !navigationRights.updateUrlPattern}
				label="Patroon"
				name="url.urlPattern"
				placeholder="Geef een url patroon op"
				required
				onBlur={handleBlurEvent}
				state={
					activeLanguage &&
					pathOr(null, ['url', 'urlPattern', activeLanguage.key], errors) &&
					'error'
				}
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
				columns={PATTERN_COLUMNS(t, tModule, importPattern, navigationRights, siteId)}
				rows={placeholders}
			/>
		</div>
	);
};

export default ContentTypeDetailUrl;
