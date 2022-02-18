import { Button, RadioGroup } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-types-module';
import { FormikOnChangeHandler, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { Field, Formik } from 'formik';
import { isEmpty } from 'ramda';
import React, { FC, useEffect, useState } from 'react';

import contentTypeConnector from '../../connectors/contentTypes';
import sitesConnector from '../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { menusFacade } from '../../store/menus';
import { MenusCheckboxList } from '../MenusCheckboxList';

import { ALLOW_MENUS_OPTIONS } from './ContentTypeSiteDetailTab.const';
import { ContentTypeSiteDetailTabFormState } from './ContentTypeSiteDetailTab.types';

const ContentTypeSiteDetailTab: FC<ExternalTabProps & { siteId: string }> = ({
	value = {} as Record<string, any>,
	isLoading,
	onCancel,
	siteId,
	contentType,
}) => {
	const initialValues: ContentTypeSiteDetailTabFormState = {
		allowMenus: value?.config?.allowMenus || false,
		menus: value?.config?.menus || [],
	};
	const [t] = useCoreTranslation();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);
	const [site] = sitesConnector.hooks.useSite(siteId);

	useEffect(() => {
		if (!siteId || !site) {
			return;
		}

		menusFacade.getMenus(siteId, {
			category: `menu_${site?.data.name}_nl`,
		});
	}, [site, siteId]);

	const onFormSubmit = async (values: any): Promise<void> => {
		const config = {
			...values,
			allowMenus: values.allowMenus === 'true',
		};

		isEmpty(value.config)
			? await contentTypeConnector.metadataFacade.createMetadata(
					siteId,
					contentType,
					{
						config,
						label: 'Navigatie',
						name: 'navigation',
						ref: contentType.uuid,
						site: siteId,
						type: 'content-type',
					},
					'update'
			  )
			: await contentTypeConnector.metadataFacade.updateMetadata(
					siteId,
					contentType,
					value.uuid,
					{
						...value,
						config,
					} as any,
					'update'
			  );

		resetChangeDetection();
	};

	return (
		<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
			{({ submitForm }) => {
				return (
					<>
						<FormikOnChangeHandler onChange={values => setFormValue(values)} />
						<div className="row">
							<p>
								Bepaal of het werken met menu&apos;s is toegestaan voor dit content
								type en of dit standaard geactiveerd moet worden.
							</p>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12 col-sm-6">
								<Field
									as={RadioGroup}
									id="allowMenus"
									name="allowMenus"
									options={ALLOW_MENUS_OPTIONS}
								/>
							</div>
						</div>
						{`${formValue.allowMenus}` === 'true' && (
							<div>
								<div className="row u-margin-top u-flex u-flex-column">
									<p>Beschikbare menu&apos;s</p>
									<small className="u-margin-top-xs">
										Selecteer de beschikbare menu&apos;s voor dit content type
									</small>
								</div>
								<div className="row u-margin-top">
									<MenusCheckboxList />
								</div>
							</div>
						)}
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

export default ContentTypeSiteDetailTab;
