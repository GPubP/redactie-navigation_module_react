import { TextField } from '@acpaas-ui/react-components';
import { Table } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import { Field, FormikValues, useFormikContext } from 'formik';
import React, { ChangeEvent, FC, useState } from 'react';

import translationsConnector from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import { PATTERN_COLUMNS, PATTERN_PLACEHOLDERS } from './ContentTypeDetailUrl.const';

const ContentTypeDetailUrl: FC<ExternalTabProps> = () => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [cursorPosition, setCursorPosition] = useState<number | null>(null);
	const { setFieldValue, values } = useFormikContext<FormikValues>();

	const handleBlur = (event: ChangeEvent<HTMLInputElement>): void => {
		setCursorPosition(event.target.selectionStart);
	};

	const importPattern = (key: string): void => {
		const urlPattern = values.url.urlPattern;

		if (!cursorPosition) {
			setFieldValue('url.urlPattern', `${urlPattern}${key}`);
			return;
		}

		const left = urlPattern.substring(0, cursorPosition);
		const right = urlPattern.substring(cursorPosition);

		setFieldValue('url.urlPattern', `${left}${key}${right}`);
		setCursorPosition(null);
	};

	return (
		<div>
			<div className="u-margin-bottom">
				<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_URL_DESCRIPTION)}</p>
			</div>
			<Field
				as={TextField}
				label="Patroon"
				name="url.urlPattern"
				placeholder="Geef een url patroon op"
				onBlur={handleBlur}
			/>
			<Table
				fixed
				className="u-margin-top"
				columns={PATTERN_COLUMNS(t, tModule, importPattern)}
				rows={PATTERN_PLACEHOLDERS(tModule)}
			/>
		</div>
	);
};

export default ContentTypeDetailUrl;
