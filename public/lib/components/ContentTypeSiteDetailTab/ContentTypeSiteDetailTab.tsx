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
import { isEmpty } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import contentTypeConnector from '../../connectors/contentTypes';
import languagesConnector from '../../connectors/languages';
import rolesRightsConnector from '../../connectors/rolesRights';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { useNavigationRights } from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, MODULE_PATHS, SITES_ROOT } from '../../navigation.const';

import ContentTypeSiteDetailForm from './ContentTypeSiteDetailForm';
import { NAV_SITE_COMPARTMENTS } from './ContentTypeSiteDetailTab.const';
import { ContentTypeSiteDetailTabFormState } from './ContentTypeSiteDetailTab.types';

const ContentTypeSiteDetailTab: FC<ExternalTabProps & { siteId: string }> = ({
	value = {} as Record<string, any>,
	isLoading,
	onCancel,
	siteId,
	contentType,
}) => {
	const [initialValues, setInitialValues] = useState<ContentTypeSiteDetailTabFormState>(
		value?.config || {}
	);
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [activeLanguage, setActiveLanguage] = useState<Language>();
	const [languagesLoading, languages] = languagesConnector.hooks.useActiveLanguagesForSite(
		siteId
	);
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasUrlChanges, resetUrlChangeDetection] = useDetectValueChanges(
		!isLoading,
		formValue.url
	);
	const [hasChanges] = useDetectValueChanges(!isLoading, formValue);
	const { generatePath } = useNavigate(SITES_ROOT);
	const { contentTypeUuid, child } = useParams<{
		contentTypeUuid: string;
		child: string;
	}>();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [metadataExists, setMetadataExists] = useState(!isEmpty(value?.config));
	const [navList, setNavlist] = useState<(NavListItem & { key: string })[]>([]);
	const activeCompartment = useMemo(
		() => NAV_SITE_COMPARTMENTS.find(compartment => compartment.to === child),
		[child]
	);
	const navigationRights = useNavigationRights(siteId);

	const history = useHistory();

	const [, mySecurityrights] = rolesRightsConnector.api.hooks.useMySecurityRightsForSite({
		siteUuid: siteId,
		onlyKeys: true,
	});

	const canReadMenu = useMemo(() => {
		return rolesRightsConnector.api.helpers.checkSecurityRights(mySecurityrights, [
			rolesRightsConnector.menuSecurityRights.read,
		]);
	}, [mySecurityrights]);

	const navListChecked =
		!navigationRights.readUrlPattern && !canReadMenu
			? []
			: !navigationRights.readUrlPattern
			? navList.filter(c => c.label !== 'URL')
			: !canReadMenu
			? navList.filter(c => c.label !== "Menu's")
			: navList;

	useEffect(() => {
		setNavlist(
			NAV_SITE_COMPARTMENTS.map(compartment => ({
				...compartment,
				activeClassName: 'is-active',
				to: generatePath(`${MODULE_PATHS.site.contentTypeDetailExternalChild}`, {
					contentTypeUuid,
					tab: CONFIG.name,
					child: compartment.to,
					siteId,
				}),
				key: compartment.to,
			}))
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentTypeUuid, siteId]);

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

	// setup preselected language
	useEffect(() => {
		if (!(Array.isArray(languages) && !activeLanguage)) {
			return;
		}

		const currentLanguage = languages.find(l => l.primary) || languages[0];
		setActiveLanguage(currentLanguage);

		if (isEmpty(initialValues)) {
			const form = {
				url: contentType.modulesConfig.find(config => config.name === 'navigation')?.config
					?.url || {
					urlPattern: {
						multilanguage: true,
					},
				},
				menu: contentType.modulesConfig.find(config => config.name === 'navigation')?.config
					?.menu || {
					allowMenus: 'false',
				},
			};
			setInitialValues(form);
			setFormValue(form);
		}
	}, [activeLanguage, contentType.modulesConfig, initialValues, languages]);

	const onConfirm = async (): Promise<void> => {
		!metadataExists
			? await contentTypeConnector.metadataFacade.createMetadata(
					siteId,
					contentType,
					{
						config: formValue,
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
						config: formValue,
					} as any,
					'update'
			  );

		setMetadataExists(true);
		setShowConfirmModal(false);
		resetUrlChangeDetection();
	};

	const onFormSubmit = (): void => {
		if (hasUrlChanges) {
			return setShowConfirmModal(true);
		}

		onConfirm();
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
				<ContentTypeSiteDetailForm
					value={initialValues}
					formValue={formValue}
					isLoading={isLoading}
					hasChanges={hasChanges}
					setFormValue={setFormValue}
					onFormSubmit={onFormSubmit}
					onCancel={onCancel}
					siteId={siteId}
					activeLanguage={activeLanguage}
					onValidateCompartments={onValidateCompartments}
				/>
			</LanguageHeader>
		);
	};

	return (
		<div className="row top-xs u-margin-bottom-lg">
			<div className="col-xs-12 col-md-3 u-margin-bottom">
				<NavList items={navListChecked} linkComponent={NavLink} />
			</div>
			<div className="col-xs-12 col-md-9">
				<div className="m-card u-padding">
					<h3 className="u-margin-bottom">{activeCompartment?.label}</h3>
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
