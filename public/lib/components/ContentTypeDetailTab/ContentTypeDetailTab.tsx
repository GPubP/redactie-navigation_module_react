import { Button, RadioGroup, Select } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-types-module';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { useDetectValueChanges } from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { FC, useMemo, useState } from 'react';

import { useCoreTranslation } from '../../connectors/translations';

import { IS_ACTIVE_TREE_OPTIONS, NAVIGATION_TREE_OPTIONS } from './ContentTypeDetailTab.const';

const ContentTypeDetailTab: FC<ExternalTabProps> = ({
	value = {} as Record<string, any>,
	isLoading,
	onSubmit,
	onCancel,
}) => {
	const initialValues = useMemo(
		() => ({
			activateTree: value?.config?.activateTree || 'false',
			navigationTree: value?.config?.navigationTree || 'hoofdnavigatie',
		}),
		[value]
	);
	const [t] = useCoreTranslation();
	const [formValue, setFormValue] = useState<any | null>(null);
	const [isChanged] = useDetectValueChanges(!isLoading, formValue);

	const onFormSubmit = (values: any): void => {
		onSubmit({ config: values, validationSchema: {} });
	};

	return (
		<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
			{({ submitForm, values }) => {
				setFormValue(values);

				return (
					<>
						<p>
							Bepaal of er voor dit content type een navigatie-item gemaakt kan worden
							verplicht is. Geef naar keuze een standaard navigatieboom op.
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
						<div className="row u-margin-top">
							<div className="col-xs-12 col-sm-6">
								<Field
									as={Select}
									id="navigationTree"
									name="navigationTree"
									label="Navigatieboom"
									required={true}
									options={NAVIGATION_TREE_OPTIONS}
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Bepaal de standaard boom die getoond moet worden. De gebruiker
									wijzigen.
								</small>
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
										disabled={isLoading || !isChanged}
										onClick={() => submitForm()}
										type="success"
										htmlType="submit"
									>
										{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
					</>
				);
			}}
		</Formik>
	);
};

export default ContentTypeDetailTab;
