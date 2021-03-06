import { Button } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
	LanguageHeader,
	NavList,
} from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-types-module';
import {
	DataLoader,
	Language,
	NavListItem,
	useDetectValueChanges,
	useNavigate,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import languagesConnector from '../../connectors/languages';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, MODULE_PATHS } from '../../navigation.const';

import ContentTypeTenantDetailForm from './ContentTypeTenantDetailForm';
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
	const [activeLanguage, setActiveLanguage] = useState<Language>();
	const [languagesLoading, languages] = languagesConnector.hooks.useActiveLanguages();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);
	const { generatePath } = useNavigate();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [navList, setNavlist] = useState<(NavListItem & { key: string })[]>([]);

	const history = useHistory();

	useEffect(() => {
		setNavlist(
			NAV_TENANT_COMPARTMENTS.map(compartment => ({
				...compartment,
				activeClassName: 'is-active',
				to: generatePath(`${MODULE_PATHS.tenantContentTypeDetailExternalChild}`, {
					contentTypeUuid,
					tab: CONFIG.name,
					child: compartment.to,
				}),
				key: compartment.to,
			}))
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentTypeUuid]);

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

	// setup preselected language
	useEffect(() => {
		if (Array.isArray(languages) && !activeLanguage) {
			setActiveLanguage(languages.find(l => l.primary) || languages[0]);
		}
	}, [activeLanguage, languages]);

	const onConfirm = (): void => {
		onSubmit({ config: formValue, validationSchema: {} });
		resetChangeDetection();
		setShowConfirmModal(false);
	};

	const onFormSubmit = (): void => {
		setShowConfirmModal(true);
	};

	const onValidateCompartments = (invalidCompartments: string[]): void => {
		setNavlist(
			navList.map(compartment => ({
				...compartment,
				hasError: invalidCompartments.includes(compartment.key),
			}))
		);
	};

	const onSavePromptCancel = (): void => {
		setShowConfirmModal(false);
	};

	const renderForm = (): ReactElement | null => {
		if (!activeLanguage) {
			return null;
		}

		return (
			<LanguageHeader
				languages={languages}
				activeLanguage={activeLanguage}
				onChangeLanguage={(language: string) => setActiveLanguage({ key: language })}
			>
				<ContentTypeTenantDetailForm
					value={value}
					formValue={formValue}
					isLoading={isLoading}
					hasChanges={hasChanges}
					setFormValue={setFormValue}
					onFormSubmit={onFormSubmit}
					onCancel={onCancel}
					onValidateCompartments={onValidateCompartments}
				/>
			</LanguageHeader>
		);
	};

	return (
		<div className="row top-xs u-margin-bottom-lg">
			<div className="col-xs-12 col-md-3 u-margin-bottom">
				<NavList items={navList} linkComponent={NavLink} />
			</div>
			<div className="col-xs-12 col-md-9">
				<div className="m-card u-padding">
					<DataLoader loadingState={languagesLoading} render={renderForm} />
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
