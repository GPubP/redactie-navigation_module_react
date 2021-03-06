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
import { ModuleSettings } from '@redactie/sites-module';
import {
	AlertContainer,
	DataLoader,
	Language,
	NavListItem,
	useDetectValueChanges,
	useNavigate,
} from '@redactie/utils';
import { isEmpty, omit } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import contentTypeConnector from '../../connectors/contentTypes';
import languagesConnector from '../../connectors/languages';
import rolesRightsConnector from '../../connectors/rolesRights';
import sitesConnector from '../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { filterSiteNavCompartments } from '../../helpers';
import { useNavigationRights } from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import {
	ALERT_CONTAINER_IDS,
	CONFIG,
	MODULE_PATHS,
	PositionValues,
	SITES_ROOT,
} from '../../navigation.const';
import { NavItemType } from '../../navigation.types';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

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
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [activeLanguage, setActiveLanguage] = useState<Language>();
	const [languagesLoading, languages] = languagesConnector.hooks.useActiveLanguagesForSite(
		siteId
	);

	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasUrlChanges, resetUrlChangeDetection] = useDetectValueChanges(
		!isLoading,
		formValue.url
	);
	const [hasSiteStructureChanges, resetSiteStructureChangeDetection] = useDetectValueChanges(
		!isLoading,
		formValue.siteStructure
	);
	const [hasMenuChanges, resetMenuChangeDetection] = useDetectValueChanges(
		!isLoading,
		formValue.menu
	);

	const hasChanges = hasUrlChanges || hasSiteStructureChanges || hasMenuChanges;

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
		if (!site) {
			return;
		}
		const siteNavigationConfig = (site?.data?.modulesConfig || []).find(
			(siteNavigationConfig: ModuleSettings) => siteNavigationConfig?.name === 'navigation'
		);

		setNavlist(
			NAV_SITE_COMPARTMENTS.filter(c =>
				filterSiteNavCompartments(c, siteNavigationConfig)
			).map(compartment => ({
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
	}, [contentTypeUuid, siteId, site]);

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
						multiLanguage: true,
					},
				},
				menu: contentType.modulesConfig.find(config => config.name === 'navigation')?.config
					?.menu || {
					activatedMenus: [],
					allowMenus: 'false',
					allowedMenus: {},
				},
				siteStructure: contentType.modulesConfig.find(
					config => config.name === 'navigation'
				)?.config?.siteStructure || {
					position: { multiLanguage: true },
					structurePosition: 'none',
				},
			};
			setInitialValues(form);
			setFormValue(form);
		}
	}, [activeLanguage, contentType.modulesConfig, initialValues, languages]);

	const handleUpdateSiteStructureItems = async (): Promise<void> => {
		await Promise.all(
			Object.keys(formValue.pendingCTSiteStructure).map((languageKey: string) => {
				const itemInfo = formValue.pendingCTSiteStructure[languageKey];
				const siteStructureItemPayload = {
					...(itemInfo.itemId && { id: itemInfo.itemId }),
					description: contentType.meta.description,
					label: contentType.meta.label,
					slug: contentType.meta.safeLabel,
					publishStatus: 'published',
					externalUrl: '',
					externalReference: contentType.uuid,
					logicalId: '',
					items: [],
					parentId: itemInfo.position,
					properties: {
						type: NavItemType.contentType,
					},
				};

				if (!itemInfo.itemId) {
					return siteStructureItemsFacade.createSiteStructureItem(
						siteId,
						itemInfo.treeId,
						siteStructureItemPayload,
						ALERT_CONTAINER_IDS.siteStructureItemsOverview
					);
				}

				return siteStructureItemsFacade.updateSiteStructureItem(
					siteId,
					itemInfo.treeId,
					siteStructureItemPayload,
					ALERT_CONTAINER_IDS.siteStructureItemsOverview
				);
			})
		);

		siteStructureItemsFacade.getContentTypeSiteStructureItems(siteId, contentType?.uuid, {});
	};

	const onConfirm = async (): Promise<void> => {
		if (
			formValue?.siteStructure?.structurePosition === PositionValues.limited &&
			!formValue?.siteStructure?.editablePosition
		) {
			handleUpdateSiteStructureItems();
		}

		!metadataExists
			? await contentTypeConnector.metadataFacade.createMetadata(
					siteId,
					contentType,
					{
						config: omit(['pendingCTSiteStructure'])(formValue),
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
						config: omit(['pendingCTSiteStructure'])(formValue),
					} as any,
					'update'
			  );

		contentTypeConnector.contentTypesFacade.getSiteContentType(siteId, contentType.uuid, true);
		setMetadataExists(true);
		setShowConfirmModal(false);
		resetMenuChangeDetection();
		resetUrlChangeDetection();
		resetSiteStructureChangeDetection();
	};

	const onValidateCompartments = (invalidCompartments: string[]): void => {
		setNavlist(
			navList.map(compartment => ({
				...compartment,
				hasError: invalidCompartments.includes(compartment.key),
			}))
		);
	};

	const onFormSubmit = (): void => {
		if (hasUrlChanges || hasSiteStructureChanges) {
			return setShowConfirmModal(true);
		}
		onConfirm();
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
					contentType={contentType}
					activeLanguage={activeLanguage}
					onValidateCompartments={onValidateCompartments}
				/>
			</LanguageHeader>
		);
	};

	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.contentTypeEdit}
			/>
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
		</>
	);
};

export default ContentTypeSiteDetailTab;
