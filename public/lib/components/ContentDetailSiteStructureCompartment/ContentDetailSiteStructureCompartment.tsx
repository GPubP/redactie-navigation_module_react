/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CardBody, Textarea, TextField } from '@acpaas-ui/react-components';
import { CompartmentProps } from '@redactie/content-module';
import { DataLoader, FormikOnChangeHandler, LoadingState, useSiteContext } from '@redactie/utils';
import { Field, Formik, FormikBag, FormikValues } from 'formik';
import { isNil } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { findPosition, getCTStructureConfig, getTreeConfig } from '../../helpers';
import {
	useContentTypeSiteStructureItems,
	useSiteStructure,
	useSiteStructureItem,
} from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, PositionValues } from '../../navigation.const';
import { CascaderOption, NavItem, NavTree } from '../../navigation.types';
import { PendingSiteStructureItem, siteStructureItemsFacade } from '../../store/siteStructureItems';
import { siteStructuresFacade } from '../../store/siteStructures';

import StructureCascader from './StructureCascader';

const ContentDetailNavigationStructureCompartment: FC<CompartmentProps> = ({
	onChange,
	contentValue,
	contentItem,
	activeLanguage,
	site,
	formikRef,
	contentType,
}) => {
	const { siteId } = useSiteContext();
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const CTStructureConfig = getCTStructureConfig(contentType, activeLanguage!, CONFIG.name, site);
	const { siteStructure, fetchingState: siteStructureLoadingState } = useSiteStructure();
	const [siteStructuresLoadingState, siteStructures] = useSiteStructures();
	const [, contentTypeSiteStructureItems] = useContentTypeSiteStructureItems();
	const {
		siteStructureItem,
		fetchingState: siteStructureItemLoadingState,
	} = useSiteStructureItem();
	const internalFormRef = useRef<FormikBag<any, any>>(null);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	const siteStructureForLang = useMemo(() => {
		if (!siteStructures || !siteId || !activeLanguage) {
			return;
		}

		return siteStructures.find(i => i.lang === activeLanguage) || null;
	}, [activeLanguage, siteId, siteStructures]);

	const treeConfig = useMemo<{
		options: CascaderOption[];
	}>(
		() =>
			getTreeConfig<NavTree, NavItem>(
				(siteStructure as unknown) as NavTree,
				siteStructure?.id as number
			),
		[siteStructure]
	);

	const initialFormValue = useMemo(() => {
		if (initialLoading === LoadingState.Loading) {
			return;
		}

		return {
			label: siteStructureItem?.label || contentValue?.fields.titel?.text || '',
			description: siteStructureItem?.description || contentValue?.fields.teaser?.text || '',
			treeId: siteStructureItem?.treeId || siteStructureForLang?.id,
			position:
				!isNil(siteStructureItem?.parentId) && treeConfig.options.length > 0
					? findPosition(treeConfig.options, siteStructureItem?.parentId)
					: [],
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteStructureItem, treeConfig.options, siteStructureForLang, initialLoading]);

	useEffect(() => {
		if (!siteId || !site?.data.name || !activeLanguage) {
			return;
		}

		siteStructuresFacade.getSiteStructures(siteId, {});
	}, [activeLanguage, site, siteId]);

	useEffect(() => {
		if (!siteStructureForLang) {
			return;
		}

		siteStructuresFacade.getSiteStructure(
			siteId,
			(siteStructureForLang?.id as unknown) as string
		);
	}, [siteId, siteStructureForLang]);

	useEffect(() => {
		if (
			siteStructureLoadingState !== LoadingState.Loading &&
			siteStructuresLoadingState !== LoadingState.Loading &&
			siteStructureItemLoadingState !== LoadingState.Loading
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [siteStructureItemLoadingState, siteStructureLoadingState, siteStructuresLoadingState]);

	useEffect(() => {
		if (!contentItem?.uuid || !siteId) {
			return;
		}

		siteStructureItemsFacade.getContentSiteStructurePrimaryItem(siteId, contentItem?.uuid);
	}, [contentItem, siteId]);

	/**
	 * Functions
	 */
	const onFormChange = (values: FormikValues): void => {
		siteStructureItemsFacade.setPendingSiteStructureItem(values as PendingSiteStructureItem);
		onChange(values);
	};

	/**
	 * Render
	 */

	const renderForm = (): ReactElement => {
		if (!initialFormValue) {
			return <></>;
		}

		return (
			<Formik
				innerRef={instance => {
					(internalFormRef as any).current = instance;
					formikRef && formikRef(instance);
				}}
				enableReinitialize
				initialValues={initialFormValue}
				onSubmit={() => undefined}
			>
				{() => {
					return (
						<>
							<FormikOnChangeHandler onChange={onFormChange} />
							<CardBody>
								<h2 className="h3 u-margin-bottom">
									{tModule(MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_TITLE)}
								</h2>
								<p className="u-margin-bottom">
									{tModule(
										MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_DESCRIPTION
									)}
								</p>
								<Field
									as={StructureCascader}
									id="position"
									name="position"
									label={tModule(MODULE_TRANSLATIONS.TABLE_POSITION)}
									required={true}
									placeholder={tModule(MODULE_TRANSLATIONS.SELECT_POSITION)}
									activeLanguage={activeLanguage}
									contentItem={contentItem}
									CTStructureConfig={CTStructureConfig}
									contentTypeSiteStructureItems={contentTypeSiteStructureItems}
									treeConfig={treeConfig}
									siteStructure={siteStructure}
								/>
								{(CTStructureConfig.position !== PositionValues.limited ||
									CTStructureConfig.editablePosition) && (
									<>
										<div className="a-input has-icon-right u-margin-bottom">
											<Field
												as={TextField}
												id="Label"
												name="label"
												label="Label"
												required={true}
												placeholder={tModule(
													MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_POSITION_LABEL_PLACEHOLDER
												)}
											/>
											<small className="u-block u-text-light u-margin-top-xs">
												{tModule(
													MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_POSITION_LABEL_HINT
												)}
											</small>
										</div>
										<div className="a-input has-icon-right">
											<Field
												as={Textarea}
												id="Label"
												name="description"
												label={t(CORE_TRANSLATIONS.DESCRIPTION)}
												required={true}
												placeholder={tModule(
													MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_POSITION_DESCRIPTION_PLACEHOLDER
												)}
											/>
											<small className="u-block u-text-light u-margin-top-xs">
												{tModule(
													MODULE_TRANSLATIONS.CONTENT_SITE_STRUCTURE_POSITION_DESCRIPTION_HINT
												)}
											</small>
										</div>
									</>
								)}
							</CardBody>
						</>
					);
				}}
			</Formik>
		);
	};

	return <DataLoader loadingState={initialLoading} render={renderForm} />;
};

export default ContentDetailNavigationStructureCompartment;
