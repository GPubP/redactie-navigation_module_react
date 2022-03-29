import { Button } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	LanguageHeaderContext,
} from '@acpaas-ui/react-editorial-components';
import {
	FormikOnChangeHandler,
	handleMultilanguageFormErrors,
	LeavePrompt,
	RenderChildRoutes,
} from '@redactie/utils';
import { Formik, FormikErrors, FormikValues } from 'formik';
import React, { FC, useContext } from 'react';

import { siteContentTypeDetailTabRoutes } from '../../..';
import languagesConnector from '../../connectors/languages';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';

import {
	FORM_VALIDATION_SCHEMA,
	SITE_DETAIL_TAB_ALLOWED_PATHS,
} from './ContentTypeSiteDetailTab.const';
import {
	ContentTypeSiteDetailFormProps,
	ContentTypeSiteDetailTabFormState,
} from './ContentTypeSiteDetailTab.types';

const ContentTypeSiteDetailForm: FC<ContentTypeSiteDetailFormProps & { siteId: string }> = ({
	value,
	isLoading,
	hasChanges,
	onFormSubmit,
	onCancel,
	setFormValue,
	siteId,
}) => {
	const initialValues: ContentTypeSiteDetailTabFormState = value?.config || {};
	const [t] = translationsConnector.useCoreTranslation();
	const [, languages] = languagesConnector.hooks.useActiveLanguagesForSite(siteId);
	const { setErrors } = useContext(LanguageHeaderContext);

	const handleOnError = (values: any, formErrors: FormikErrors<FormikValues>): void => {
		setFormValue(values);

		const newErrors = handleMultilanguageFormErrors(formErrors, values);
		setErrors(newErrors);
	};

	return (
		<Formik
			onSubmit={onFormSubmit}
			initialValues={initialValues}
			validationSchema={() => FORM_VALIDATION_SCHEMA(languages || [])}
		>
			{({ errors, submitForm }) => {
				console.log({ errors });
				return (
					<div className="u-margin-top">
						<FormikOnChangeHandler
							delay={5000}
							onChange={setFormValue}
							onError={handleOnError}
						/>
						<RenderChildRoutes
							routes={siteContentTypeDetailTabRoutes}
							extraOptions={{
								siteId,
							}}
						/>
						<ActionBar className="o-action-bar--fixed" isOpen>
							<ActionBarContentSection>
								<div className="u-wrapper row end-xs">
									<Button
										className="u-margin-right-xs"
										onClick={onCancel}
										negative
									>
										{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
									</Button>
									<Button
										iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
										disabled={isLoading || !hasChanges}
										onClick={submitForm}
										type="success"
										htmlType="submit"
									>
										{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
						<LeavePrompt
							allowedPaths={SITE_DETAIL_TAB_ALLOWED_PATHS}
							shouldBlockNavigationOnConfirm
							when={hasChanges}
							onConfirm={submitForm}
						/>
					</div>
				);
			}}
		</Formik>
	);
};

export default ContentTypeSiteDetailForm;
