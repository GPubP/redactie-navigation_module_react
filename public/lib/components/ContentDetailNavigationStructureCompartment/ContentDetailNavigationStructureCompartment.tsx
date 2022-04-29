/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CardBody, Textarea, TextField } from '@acpaas-ui/react-components';
import { CompartmentProps, ContentSchema } from '@redactie/content-module';
import { CascaderOption, FormikOnChangeHandler, useSiteContext } from '@redactie/utils';
import { Field, Formik, FormikBag, FormikValues } from 'formik';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { getCTStructureConfig, getTreeConfig } from '../../helpers';
import { useSiteStructure } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, PositionValues } from '../../navigation.const';
import { NavItem, NavTree } from '../../navigation.types';
import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

import StructureCascader from './StructureCascader';

const ContentDetailNavigationStructureCompartment: FC<CompartmentProps> = ({
	updateContentMeta,
	contentValue,
	contentItem,
	activeLanguage,
	onChange,
	site,
	formikRef,
	contentType,
}) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const CTStructureConfig = getCTStructureConfig(contentType, activeLanguage!, CONFIG.name, site);
	const [, siteStructures] = useSiteStructures();
	const { siteStructure } = useSiteStructure();
	const [siteStructureForLang, setSiteStructureForLang] = useState<SiteStructure | null>(null);

	/**
	 * Hooks
	 */
	// Context hooks
	const { siteId } = useSiteContext();

	useEffect(() => {
		if (!siteId || !site?.data.name || !activeLanguage) {
			return;
		}

		siteStructuresFacade.getSiteStructures(siteId, {});
	}, [activeLanguage, site, siteId]);

	useEffect(() => {
		if (!siteStructures || !siteId || !activeLanguage) {
			return;
		}

		setSiteStructureForLang(siteStructures.find(i => i.lang === activeLanguage) || null);
	}, [activeLanguage, siteId, siteStructures]);

	useEffect(() => {
		if (!siteStructureForLang) {
			return;
		}

		siteStructuresFacade.getSiteStructure(
			siteId,
			(siteStructureForLang?.id as unknown) as string
		);
	}, [siteId, siteStructureForLang]);

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

	// Local state hooks
	const internalFormRef = useRef<FormikBag<any, any>>(null);

	/**
	 * Functions
	 */
	const onFormChange = (values: FormikValues): void => {
		updateContentMeta((values as ContentSchema).meta);
	};

	/**
	 * Render
	 */
	return (
		<>
			<Formik
				innerRef={instance => {
					(internalFormRef as any).current = instance;
					formikRef && formikRef(instance);
				}}
				enableReinitialize
				initialValues={contentValue!}
				onSubmit={onChange}
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
									name="meta.sitestructuur.position"
									label={tModule(MODULE_TRANSLATIONS.TABLE_POSITION)}
									required={true}
									placeholder={tModule(MODULE_TRANSLATIONS.SELECT_POSITION)}
									activeLanguage={activeLanguage}
									contentItem={contentItem}
									CTStructureConfig={CTStructureConfig}
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
												name="meta.sitestructuur.label"
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
												name="meta.sitestructuur.description"
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
		</>
	);
};

export default ContentDetailNavigationStructureCompartment;
