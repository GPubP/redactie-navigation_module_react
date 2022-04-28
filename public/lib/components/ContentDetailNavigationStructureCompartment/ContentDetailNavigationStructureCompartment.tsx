/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CardBody, Textarea, TextField } from '@acpaas-ui/react-components';
import { CompartmentProps, ContentSchema } from '@redactie/content-module';
import { CascaderOption, FormikOnChangeHandler, useSiteContext } from '@redactie/utils';
import { Field, Formik, FormikBag, FormikValues } from 'formik';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import { getCTStructureConfig, getTreeConfig } from '../../helpers';
import { useSiteStructure } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
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
								<h2 className="h3 u-margin-bottom">Sitestructuur</h2>
								<p className="u-margin-bottom">
									Plaats dit content item in de sitestructuur
								</p>
								<Field
									as={StructureCascader}
									id="position"
									name={`meta.sitestructuur.position.${activeLanguage}`}
									label="Positie"
									required={true}
									placeholder="Selecteer een positie"
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
												name="name"
												label="Slug"
												required={true}
												placeholder="Vul naam slug in"
											/>
											<small className="u-block u-text-light u-margin-top-xs">
												Geef een naam of &quot;label&quot; op voor dit item.
											</small>
										</div>
										<div className="a-input has-icon-right">
											<Field
												as={Textarea}
												id="Label"
												name={`meta.slug.${activeLanguage}`}
												label="Beschrijving"
												required={true}
												placeholder="Vul een beschrijving in"
											/>
											<small className="u-block u-text-light u-margin-top-xs">
												Geef dit item een korte beschrijving
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
