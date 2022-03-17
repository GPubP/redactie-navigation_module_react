import { Button } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
	LanguageHeader,
	NavList,
} from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-types-module';
import {
	FormikOnChangeHandler,
	LeavePrompt,
	RenderChildRoutes,
	useDetectValueChanges,
	useNavigate,
} from '@redactie/utils';
import { Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import { tenantContentTypeDetailTabRoutes } from '../../../index';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, MODULE_PATHS } from '../../navigation.const';

import { NAV_TENANT_COMPARTMENTS } from './ContentTypeTenantDetailTab.const';
import { ContentTypeTenantDetailTabFormState } from './ContentTypeTenantDetailTab.types';

const ContentTypeTenantDetailTab: FC<ExternalTabProps> = ({
	value = {} as Record<string, any>,
	isLoading,
	onSubmit,
	onCancel,
}) => {
	const initialValues: ContentTypeTenantDetailTabFormState = value?.config
		? value.config
		: {
				url: {
					urlPattern: {
						multilanguage: true,
					},
				},
		  };

	const { contentTypeUuid, child } = useParams<{
		contentTypeUuid: string;
		child: string;
	}>();
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);
	const { generatePath } = useNavigate();
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const history = useHistory();

	useEffect(() => {
		if (!child) {
			history.replace(
				generatePath(`${MODULE_PATHS.tenantContentTypeDetailExternalChild}`, {
					contentTypeUuid,
					tab: CONFIG.name,
					child: NAV_TENANT_COMPARTMENTS[0].to,
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [child]);

	const onConfirm = (): void => {
		onSubmit({ config: formValue, validationSchema: {} });
		resetChangeDetection();
		setShowConfirmModal(false);
	};

	const onFormSubmit = (): void => {
		setShowConfirmModal(true);
	};

	const onSavePromptCancel = (): void => {
		setShowConfirmModal(false);
	};

	console.log('cjecl');

	return (
		<div className="row top-xs u-margin-bottom-lg">
			<div className="col-xs-12 col-md-3 u-margin-bottom">
				<NavList
					items={NAV_TENANT_COMPARTMENTS.map(compartment => ({
						...compartment,
						activeClassName: 'is-active',
						to: generatePath(`${MODULE_PATHS.tenantContentTypeDetailExternalChild}`, {
							contentTypeUuid,
							tab: CONFIG.name,
							child: compartment.to,
						}),
					}))}
					linkComponent={NavLink}
				/>
			</div>
			<div className="col-xs-12 col-md-9">
				<div className="m-card u-padding">
					<LanguageHeader
						//	TODO: Implement multilanguage
						languages={[{ key: 'nl', primary: true }]}
						activeLanguage={{ key: 'nl' }}
						onChangeLanguage={console.log}
					>
						<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
							{({ submitForm }) => {
								return (
									<div className="u-margin-top">
										<FormikOnChangeHandler onChange={setFormValue} />
										<RenderChildRoutes
											routes={tenantContentTypeDetailTabRoutes}
											extraOptions={{}}
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
														iconLeft={
															isLoading
																? 'circle-o-notch fa-spin'
																: null
														}
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
									</div>
								);
							}}
						</Formik>
					</LanguageHeader>
					<ControlledModal
						show={showConfirmModal}
						onClose={onSavePromptCancel}
						size="large"
					>
						<ControlledModalHeader>
							<h4>{t(CORE_TRANSLATIONS.CONFIRM)}</h4>
						</ControlledModalHeader>
						<ControlledModalBody>
							{tModule(MODULE_TRANSLATIONS.TENANT_NAVIGATION_CONFIRM_DESCRIPTION)}
						</ControlledModalBody>
						<ControlledModalFooter>
							<div className="u-flex u-flex-item u-flex-justify-end">
								<Button onClick={onSavePromptCancel} negative>
									{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
								</Button>
								<Button
									iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
									disabled={isLoading}
									onClick={onConfirm}
									type="success"
								>
									{t(CORE_TRANSLATIONS.MODAL_CONFIRM)}
								</Button>
							</div>
						</ControlledModalFooter>
					</ControlledModal>
				</div>
			</div>
		</div>
	);
};

export default ContentTypeTenantDetailTab;
