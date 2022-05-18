import { Button } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	LanguageHeaderContext,
} from '@acpaas-ui/react-editorial-components';
import {
	alertService,
	FormikOnChangeHandler,
	LeavePrompt,
	RenderChildRoutes,
} from '@redactie/utils';
import { Formik, FormikErrors, FormikValues } from 'formik';
import { isEmpty } from 'lodash';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { siteContentTypeDetailTabRoutes } from '../../..';
import languagesConnector from '../../connectors/languages';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { getCompartmentErrors } from '../../helpers';
import { ALERT_CONTAINER_IDS } from '../../navigation.const';

import {
	FORM_VALIDATION_SCHEMA,
	NavSiteCompartments,
	SITE_DETAIL_TAB_ALLOWED_PATHS,
} from './ContentTypeSiteDetailTab.const';
import { ContentTypeSiteDetailFormProps } from './ContentTypeSiteDetailTab.types';

const ContentTypeSiteDetailForm: FC<ContentTypeSiteDetailFormProps> = ({
	value = {},
	formValue,
	isLoading,
	hasChanges,
	onFormSubmit,
	contentType,
	onCancel,
	setFormValue,
	onValidateCompartments,
	siteId,
	activeLanguage,
}) => {
	const { child } = useParams<{ child: string }>();
	const [t] = translationsConnector.useCoreTranslation();
	const [, languages] = languagesConnector.hooks.useActiveLanguagesForSite(siteId);
	const { setErrors } = useContext(LanguageHeaderContext);
	const [activeCompartment, setActiveCompartment] = useState(child ?? NavSiteCompartments.menu);
	const [invalidCompartment, setInvalidCompartment] = useState<string[]>();
	const [currentFormErrors, setCurrentFormErrors] = useState<FormikErrors<FormikValues>>({});

	useEffect(() => {
		setErrors(getCompartmentErrors(currentFormErrors, formValue, activeCompartment));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeCompartment]);

	const validateCompartments = (errors: FormikErrors<FormikValues>): void => {
		const invalidCompartments = Object.values(NavSiteCompartments).filter(compartment => {
			const compartmentErrors = getCompartmentErrors(errors, formValue, compartment);

			return !!Object.values(compartmentErrors).find(langErrors => !isEmpty(langErrors));
		});
		onValidateCompartments(invalidCompartments);
		setInvalidCompartment(invalidCompartments);
	};

	const handleOnError = (values: FormikValues, formErrors: FormikErrors<FormikValues>): void => {
		setCurrentFormErrors(formErrors);
		validateCompartments(formErrors);
		setFormValue(values);
		setErrors(getCompartmentErrors(formErrors, formValue, activeCompartment));
	};

	const alert = (): void => {
		alertService.invalidForm({
			containerId: ALERT_CONTAINER_IDS.contentTypeEdit,
		});
	};

	const onChange = (values: FormikValues): void => {
		setFormValue(values);
		alertService.dismiss();
	};

	return (
		<Formik
			onSubmit={onFormSubmit}
			initialValues={value}
			enableReinitialize={true}
			validationSchema={() => FORM_VALIDATION_SCHEMA(languages || [])}
		>
			{({ submitForm, errors }) => {
				return (
					<div className="u-margin-top">
						<FormikOnChangeHandler onChange={onChange} onError={handleOnError} />
						<RenderChildRoutes
							routes={siteContentTypeDetailTabRoutes}
							extraOptions={{
								siteId,
								activeLanguage,
								setActiveCompartment,
								contentType,
								value,
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
										onClick={
											(invalidCompartment && invalidCompartment.length > 0) ||
											Object.entries(errors).length !== 0
												? alert
												: submitForm
										}
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
