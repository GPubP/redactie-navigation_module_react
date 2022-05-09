/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CardBody, Textarea, TextField } from '@acpaas-ui/react-components';
import { CompartmentProps } from '@redactie/content-module';
import {
	DataLoader,
	ErrorMessage,
	FormikOnChangeHandler,
	LoadingState,
	useSiteContext,
} from '@redactie/utils';
import { Field, Formik, FormikBag, FormikValues } from 'formik';
import { isNil } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import {
	findPosition,
	generateEmptyNavItem,
	getCTStructureConfig,
	getTreeConfig,
} from '../../helpers';
import { SITE_STRUCTURE_VALIDATION_SCHEMA } from '../../helpers/contentCompartmentHooks/beforeAfterSubmit.const';
import { usePendingSiteStructureItem, useSiteStructure, useSiteStructureItem } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, PositionValues } from '../../navigation.const';
import { CascaderOption, NavItem, NavItemType, NavTree } from '../../navigation.types';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';
import { siteStructuresFacade } from '../../store/siteStructures';
import { StructureCascader } from '../StructureCascader';

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
	const [siteStructuresLoadingState, siteStructures] = useSiteStructures(siteId);
	const internalFormRef = useRef<FormikBag<any, any>>(null);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);

	const siteStructureForLang = useMemo(() => {
		if (!siteStructures || !siteId || !activeLanguage) {
			return;
		}

		return siteStructures.find(i => i.lang === activeLanguage) || null;
	}, [activeLanguage, siteId, siteStructures]);

	const {
		siteStructureItem,
		fetchingState: siteStructureItemLoadingState,
	} = useSiteStructureItem(`${contentItem?.uuid}`);

	const [pendingSiteStructureItem] = usePendingSiteStructureItem(`${contentItem?.uuid}`);

	const { siteStructure, fetchingState: siteStructureLoadingState } = useSiteStructure(
		`${siteStructureForLang?.id}`
	);

	const treeConfig = useMemo<{
		options: CascaderOption[];
	}>(
		() =>
			getTreeConfig<NavTree, NavItem>(
				(siteStructure as unknown) as NavTree,
				siteStructureItem?.id as number
			),
		[siteStructure, siteStructureItem]
	);

	const initialFormValue = useMemo(() => {
		if (initialLoading === LoadingState.Loading) {
			return;
		}

		const formValue = {
			label:
				pendingSiteStructureItem?.label ||
				siteStructureItem?.label ||
				contentValue?.fields.titel?.text ||
				'',
			description:
				pendingSiteStructureItem?.description ||
				siteStructureItem?.description ||
				contentValue?.fields.teaser?.text ||
				'',
			position:
				!isNil(siteStructureItem?.parentId) && treeConfig.options.length > 0
					? findPosition(treeConfig.options, siteStructureItem?.parentId)
					: [],
		};

		siteStructureItemsFacade.setPendingSiteStructureItem(
			{
				...(pendingSiteStructureItem as NavItem),
				...(!pendingSiteStructureItem?.treeId && {
					treeId: siteStructureForLang?.id,
				}),
				label: formValue.label,
				description: formValue.description,
				parentId: formValue.position?.slice(-1)[0],
			},
			`${contentItem?.uuid}`
		);

		return formValue;
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
			return;
		}

		setInitialLoading(LoadingState.Loading);
	}, [siteStructureItemLoadingState, siteStructureLoadingState, siteStructuresLoadingState]);

	useEffect(() => {
		if (!contentItem?.uuid || !siteId) {
			return;
		}

		siteStructureItemsFacade.getContentSiteStructurePrimaryItem(siteId, contentItem?.uuid);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteId]);

	useEffect(() => {
		if (siteStructureItemLoadingState !== LoadingState.Loaded) {
			return;
		}

		siteStructureItemsFacade.setPendingSiteStructureItem(
			siteStructureItem ? siteStructureItem : generateEmptyNavItem(NavItemType.primary),
			`${contentItem?.uuid}`
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteStructureItem, siteStructureItemLoadingState]);

	/**
	 * Functions
	 */
	const onFormChange = (values: FormikValues): void => {
		siteStructureItemsFacade.setPendingSiteStructureItem(
			{
				...(pendingSiteStructureItem as NavItem),
				...(!pendingSiteStructureItem?.treeId && {
					treeId: siteStructureForLang?.id,
				}),
				label: values.label,
				description: values.description,
				parentId: values.position?.slice(-1)[0],
			},
			`${contentItem?.uuid}`
		);
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
				validationSchema={SITE_STRUCTURE_VALIDATION_SCHEMA}
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
									treeConfig={treeConfig}
									siteStructure={siteStructure}
									siteStructureItem={siteStructureItem}
								/>
								{(CTStructureConfig?.structurePosition !== PositionValues.limited ||
									(CTStructureConfig?.structurePosition ===
										PositionValues.limited &&
										CTStructureConfig?.editablePosition)) && (
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
											<ErrorMessage name="label" />
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
											<ErrorMessage name="description" />
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
