import { Button, RadioGroup } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-types-module';
import { FormikOnChangeHandler, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { FC, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';

import { IS_ACTIVE_TREE_OPTIONS } from './ContentTypeTenantDetailTab.const';
import { ContentTypeTenantDetailTabFormState } from './ContentTypeTenantDetailTab.types';

const ContentTypeTenantDetailTab: FC<ExternalTabProps> = ({
	value = {} as Record<string, any>,
	isLoading,
	onSubmit,
	onCancel,
}) => {
	const initialValues: ContentTypeTenantDetailTabFormState = {
		activateTree: value?.config?.activateTree || 'false',
	};
	const [t] = useCoreTranslation();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);

	const onFormSubmit = (values: any): void => {
		onSubmit({ config: values, validationSchema: {} });
		resetChangeDetection();
	};

	return (
		<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
			{({ submitForm }) => {
				return (
					<>
						<FormikOnChangeHandler onChange={values => setFormValue(values)} />
						<p>
							Bepaal of er voor dit content type een navigatie-item gemaakt kan
							worden.
						</p>
						<div className="row u-margin-top">
							<div className="col-xs-12 col-sm-6">
								<Field
									as={RadioGroup}
									id="activateTree"
									name="activateTree"
									options={IS_ACTIVE_TREE_OPTIONS}
								/>
							</div>
						</div>
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
							shouldBlockNavigationOnConfirm
							when={hasChanges}
							onConfirm={submitForm}
						/>
					</>
				);
			}}
		</Formik>
	);
};

export default ContentTypeTenantDetailTab;
