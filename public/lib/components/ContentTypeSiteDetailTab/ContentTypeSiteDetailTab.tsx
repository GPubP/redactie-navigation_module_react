import { Button, RadioGroup } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
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
import { Field, Formik } from 'formik';
import { isEmpty } from 'ramda';
import React, { FC, useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import { siteContentTypeDetailTabRoutes } from '../../..';
import contentTypeConnector from '../../connectors/contentTypes';
import sitesConnector from '../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { formatMenuCategory } from '../../helpers/formatMenuCategory';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, MODULE_PATHS, SITES_ROOT } from '../../navigation.const';
import { menusFacade } from '../../store/menus';
import { MenusCheckboxList } from '../MenusCheckboxList';

import { NAV_SITE_COMPARTMENTS } from './ContentTypeSiteDetailTab.const';

const ContentTypeSiteDetailTab: FC<ExternalTabProps & { siteId: string }> = ({
	value = {} as Record<string, any>,
	isLoading,
	onCancel,
	siteId,
	contentType,
}) => {
	const initialValues = {};
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);
	const { generatePath } = useNavigate(SITES_ROOT);
	const { contentTypeUuid, child } = useParams<{
		contentTypeUuid: string;
		child: string;
	}>();
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const history = useHistory();

	useEffect(() => {
		if (!child) {
			history.replace(
				generatePath(`${MODULE_PATHS.site.contentTypeDetailExternalChild}`, {
					contentTypeUuid,
					tab: CONFIG.name,
					child: NAV_SITE_COMPARTMENTS[0].to,
					siteId,
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [child]);

	const onConfirm = async (values: any): Promise<void> => {
		const config = {
			test: 'test',
		};

		// TEMP
		value.config = config;

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

		setShowConfirmModal(false);
		resetChangeDetection();
	};

	const onFormSubmit = (): void => {
		setShowConfirmModal(true);
	};

	const onSavePromptCancel = (): void => {
		setShowConfirmModal(false);
	};

	return (
		<div className="row top-xs u-margin-bottom-lg">
			<div className="col-xs-12 col-md-3 u-margin-bottom">
				<NavList
					items={NAV_SITE_COMPARTMENTS.map(compartment => ({
						...compartment,
						activeClassName: 'is-active',
						to: generatePath(`${MODULE_PATHS.site.contentTypeDetailExternalChild}`, {
							contentTypeUuid,
							tab: CONFIG.name,
							child: compartment.to,
							siteId,
						}),
					}))}
					linkComponent={NavLink}
				/>
			</div>
			<div className="col-xs-12 col-md-9">
				<div className="m-card u-padding">
					<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
						{({ submitForm }) => {
							return (
								<>
									<FormikOnChangeHandler onChange={setFormValue} />
									<RenderChildRoutes
										routes={siteContentTypeDetailTabRoutes}
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
														isLoading ? 'circle-o-notch fa-spin' : null
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
								</>
							);
						}}
					</Formik>
					<ControlledModal
						show={showConfirmModal}
						onClose={onSavePromptCancel}
						size="large"
					>
						<ControlledModalHeader>
							<h4>{t(CORE_TRANSLATIONS.CONFIRM)}</h4>
						</ControlledModalHeader>
						<ControlledModalBody>
							{tModule(MODULE_TRANSLATIONS.SITE_NAVIGATION_CONFIRM_DESCRIPTION)}
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

export default ContentTypeSiteDetailTab;
