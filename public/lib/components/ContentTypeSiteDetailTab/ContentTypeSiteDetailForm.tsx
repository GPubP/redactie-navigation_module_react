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
import { isEmpty } from 'lodash';
import React, { FC, useContext, useEffect, useState } from 'react';

import { siteContentTypeDetailTabRoutes } from '../../..';
import languagesConnector from '../../connectors/languages';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';

import { getCompartmentErrors } from './ContentTypeSiteDetailForm.helpers';
import {
	FORM_VALIDATION_SCHEMA,
	NavSiteCompartments,
	SITE_DETAIL_TAB_ALLOWED_PATHS,
} from './ContentTypeSiteDetailTab.const';
import {
	ContentTypeSiteDetailFormProps,
	ContentTypeSiteDetailTabFormState,
} from './ContentTypeSiteDetailTab.types';

const ContentTypeSiteDetailForm: FC<ContentTypeSiteDetailFormProps> = ({
	value,
	formValue,
	isLoading,
	hasChanges,
	onFormSubmit,
	onCancel,
	setFormValue,
	onValidateCompartments,
	siteId,
	activeLanguage,
}) => {
	const initialValues: ContentTypeSiteDetailTabFormState = value?.config || {};
	const [t] = translationsConnector.useCoreTranslation();
	const [, languages] = languagesConnector.hooks.useActiveLanguagesForSite(siteId);
	const { setErrors } = useContext(LanguageHeaderContext);
	const [activeCompartment, setActiveCompartment] = useState(NavSiteCompartments.url);
	const [currentFormErrors, setCurrentFormErrors] = useState<FormikErrors<FormikValues>>({});

	useEffect(() => {
		setErrors(getCompartmentErrors(currentFormErrors, formValue, activeCompartment));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeCompartment]);

	const validateCompartments = (errors: FormikErrors<FormikValues>): void => {
		console.log(errors);

		console.log(getCompartmentErrors(errors, formValue, 'url'));
		console.log(getCompartmentErrors(errors, formValue, 'menu'));

		const invalidCompartments = Object.values(NavSiteCompartments).filter(compartment => {
			const compartmentErrors = getCompartmentErrors(errors, formValue, compartment);

			return !!Object.values(compartmentErrors).find(langErrors => !isEmpty(langErrors));
		});

		onValidateCompartments(invalidCompartments);
	};

	const handleOnError = (values: FormikValues, formErrors: FormikErrors<FormikValues>): void => {
		setCurrentFormErrors(formErrors);
		validateCompartments(formErrors);

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
			{({ submitForm }) => {
				return (
					<div className="u-margin-top">
						<FormikOnChangeHandler onChange={setFormValue} onError={handleOnError} />
						<RenderChildRoutes
							routes={siteContentTypeDetailTabRoutes}
							extraOptions={{
								siteId,
								activeLanguage,
								setActiveCompartment,
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
