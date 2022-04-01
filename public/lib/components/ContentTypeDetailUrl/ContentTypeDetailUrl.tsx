import { TextField } from '@acpaas-ui/react-components';
import { LanguageHeaderContext, Table } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import { FormikMultilanguageField, useSiteContext } from '@redactie/utils';
import { FormikValues, useFormikContext } from 'formik';
import { pathOr } from 'ramda';
import React, { ChangeEvent, FC, useContext, useState } from 'react';

import translationsConnector from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import { PATTERN_COLUMNS, PATTERN_PLACEHOLDERS } from './ContentTypeDetailUrl.const';

const ContentTypeDetailUrl: FC<ExternalTabProps> = () => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [cursorPosition, setCursorPosition] = useState<number | null>(null);
	const { setFieldValue, values } = useFormikContext<FormikValues>();
	const { siteId } = useSiteContext();
	const { activeLanguage } = useContext(LanguageHeaderContext);

	const handleBlur = (event: ChangeEvent<HTMLInputElement>): void => {
		setCursorPosition(event.target.selectionStart);
	};

	const importPattern = (key: string): void => {
		const urlPattern = pathOr('', ['url', 'urlPattern', activeLanguage.key], values);

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
			<Table
				fixed
				className="u-margin-top"
				columns={PATTERN_COLUMNS(t, tModule, importPattern)}
				rows={PATTERN_PLACEHOLDERS(tModule, !!siteId)}
			/>
		</div>
	);
};

export default ContentTypeDetailUrl;
