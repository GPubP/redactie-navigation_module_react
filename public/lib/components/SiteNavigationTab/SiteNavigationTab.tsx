import { Button, RadioGroup } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/sites-module';
import { LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { ChangeEvent, FC, useState } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';

import { SITE_NAVIGATION_OPTIONS } from './SiteNavigationTab.const';
import { SiteNavigationTabFormState } from './SiteNavigationTab.types';

const SiteNavigationTab: FC<ExternalTabProps> = ({
	value = {} as Record<string, any>,
	isLoading,
	onSubmit,
	onCancel,
}) => {
	const initialValues: SiteNavigationTabFormState = {
		allowSiteStructure: value?.config?.allowSiteStructure || false,
		allowMenus: value?.config?.allowMenus || false,
	};
	const [t] = translationsConnector.useCoreTranslation();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);

	const onFormSubmit = (): void => {
		onSubmit({
			config: formValue,
			validationSchema: {},
		});
		resetChangeDetection();
	};

	return (
		<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
			{({ submitForm }) => {
				return (
					<>
						<p>Bepaal of er voor deze site sitestructuren zijn toegestaan.</p>
						<div className="row u-margin-top">
							<div className="col-xs-12 col-sm-6">
								<Field
									as={RadioGroup}
									id="allowSiteStructure"
									name="allowSiteStructure"
									options={SITE_NAVIGATION_OPTIONS}
									onChange={(event: ChangeEvent<any>) =>
										setFormValue({
											...formValue,
											allowSiteStructure: event.target.value === 'true',
										})
									}
								/>
							</div>
						</div>
						<div className="u-margin-top">
							<p>Bepaal of er voor deze site menu&apos;s zijn toegestaan.</p>
							<div className="col-xs-12 col-sm-6">
								<div className="row u-margin-top">
									<Field
										as={RadioGroup}
										id="allowMenus"
										name="allowMenus"
										options={SITE_NAVIGATION_OPTIONS}
										onChange={(event: ChangeEvent<any>) =>
											setFormValue({
												...formValue,
												allowMenus: event.target.value === 'true',
											})
										}
									/>
								</div>
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

export default SiteNavigationTab;
