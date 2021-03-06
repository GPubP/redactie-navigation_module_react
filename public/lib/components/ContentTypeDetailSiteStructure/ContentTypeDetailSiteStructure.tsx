import { Checkbox, RadioGroup } from '@acpaas-ui/react-components';
import { LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import { FormikMultilanguageField, LoadingState } from '@redactie/utils';
import { Field, FormikValues, useFormikContext } from 'formik';
import { isEmpty, isNil } from 'ramda';
import React, { ChangeEvent, FC, useContext, useEffect, useMemo, useRef, useState } from 'react';

import languagesConnector from '../../connectors/languages';
import sitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { findPosition, getTreeConfig } from '../../helpers';
import {
	useContentTypeSiteStructureItems,
	useSiteStructure,
	useSiteStructureRights,
} from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, PositionValues, SITE_STRUCTURE_POSITION_OPTIONS } from '../../navigation.const';
import { CascaderOption, NavItem, NavTree } from '../../navigation.types';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';
import { siteStructuresFacade } from '../../store/siteStructures';
import { NavSiteCompartments } from '../ContentTypeSiteDetailTab/ContentTypeSiteDetailTab.const';
import ContentTypeStructureCascader from '../ContentTypeStructureCascader/ContentTypeScructureCascader';

const ContentTypeDetailSiteStructure: FC<ExternalTabProps & {
	setActiveCompartment: React.Dispatch<React.SetStateAction<NavSiteCompartments>>;
}> = ({ siteId, contentType, setActiveCompartment }) => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values, setFieldValue, touched } = useFormikContext<FormikValues>();
	const { activeLanguage } = useContext(LanguageHeaderContext);
	const [, siteStructures] = useSiteStructures(siteId);
	const [
		contentTypeSiteStructureItemsLoading,
		contentTypeSiteStructureItems,
	] = useContentTypeSiteStructureItems(contentType.uuid);
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [, languages] = languagesConnector.hooks.useActiveLanguagesForSite(siteId);
	const [initFields, setInitFields] = useState(false);
	const prevLangSiteStructure = useRef<number | undefined>();
	const [langSiteStructureId, setLangSiteStructureId] = useState<number | undefined>(
		prevLangSiteStructure.current
	);
	const { siteStructure } = useSiteStructure(`${langSiteStructureId}`);
	const siteStructureItem = useMemo(() => {
		if (!contentTypeSiteStructureItems || !Array.isArray(contentTypeSiteStructureItems)) {
			return;
		}

		return contentTypeSiteStructureItems?.find(item => item.treeId === siteStructure?.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentTypeSiteStructureItems, siteStructure]);
	const [siteStructurePosition, setSiteStructurePosition] = useState<Record<string, number[]>>(
		{}
	);
	const [siteStructuresRights] = useSiteStructureRights(siteId);

	useEffect(() => {
		setActiveCompartment(NavSiteCompartments.siteStructure);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (
			initFields ||
			!languages?.length ||
			!siteStructures?.length ||
			contentTypeSiteStructureItemsLoading !== LoadingState.Loaded ||
			isEmpty(touched)
		) {
			return;
		}

		(languages || [])?.forEach(lang => {
			const langSiteStructure = (siteStructures || []).find(i => i.lang === lang.key);
			const langSiteStructureItem = contentTypeSiteStructureItems?.find(
				item => item.treeId === langSiteStructure?.id
			);

			setFieldValue(`pendingCTSiteStructure.${lang.key}.treeId`, langSiteStructure?.id);
			setFieldValue(`pendingCTSiteStructure.${lang.key}.itemId`, langSiteStructureItem?.id);
		});

		setInitFields(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [languages, contentTypeSiteStructureItems, siteStructures, touched]);

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

		const langSiteStructure = siteStructures.find(i => i.lang === activeLanguage.key) || null;

		if (langSiteStructure && langSiteStructure?.id !== prevLangSiteStructure.current) {
			siteStructuresFacade.getSiteStructure(
				siteId,
				(langSiteStructure?.id as unknown) as string
			);
			prevLangSiteStructure.current = langSiteStructure?.id;
			setLangSiteStructureId(langSiteStructure.id);
		}

		setInitFields(false);
	}, [activeLanguage, siteId, siteStructures]);

	useEffect(() => {
		if (!contentType) {
			return;
		}

		siteStructureItemsFacade.getContentTypeSiteStructureItems(siteId, contentType?.uuid, {});
	}, [siteId, contentType]);

	const treeConfig = useMemo<{
		options: CascaderOption[];
	}>(
		() =>
			getTreeConfig<NavTree, NavItem>(
				(siteStructure as unknown) as NavTree,
				siteStructureItem?.id || 0
			),
		[siteStructure, siteStructureItem]
	);

	useEffect(() => {
		if (!contentType) {
			return;
		}

		const modulesConfig = contentType?.modulesConfig?.find(module => {
			return module.site === siteId && module.name === CONFIG.name;
		});

		const parentId = modulesConfig?.config.siteStructure?.position[activeLanguage.key];

		const position =
			!isNil(parentId) && treeConfig.options.length > 0
				? findPosition(treeConfig.options, parentId)
				: [];

		setSiteStructurePosition({
			...siteStructurePosition,
			[activeLanguage.key]: position,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeLanguage.key, contentType, siteId, treeConfig]);

	const handlePositionOnChange = (value: number[]): void => {
		const parentId = value.slice(-1)[0];

		setSiteStructurePosition({
			...siteStructurePosition,
			[activeLanguage.key]: value,
		});

		setFieldValue(`pendingCTSiteStructure.${activeLanguage.key}.position`, parentId);
		setFieldValue(`siteStructure.position.${activeLanguage.key}`, parentId);
	};

	const onEditableToggle = (e: ChangeEvent<HTMLInputElement>): void => {
		setFieldValue('siteStructure.editablePosition', e.target.checked);
	};

	const handleClearInput = (e: React.SyntheticEvent): void => {
		e.preventDefault();
		e.stopPropagation();

		setSiteStructurePosition({
			...siteStructurePosition,
			[activeLanguage.key]: [],
		});
		setFieldValue(`pendingCTSiteStructure.${activeLanguage.key}.position`, '');
		setFieldValue(`siteStructure.position.${activeLanguage.key}`, '');
	};

	return (
		<div>
			{siteStructuresRights.update && (
				<>
					<div className="u-margin-bottom">
						<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_SITE_STRUCTURE_DESCRIPTION)}</p>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<Field
								as={RadioGroup}
								id="structurePosition"
								name="siteStructure.structurePosition"
								options={SITE_STRUCTURE_POSITION_OPTIONS}
								value={
									values.siteStructure?.structurePosition ||
									SITE_STRUCTURE_POSITION_OPTIONS[0].value
								}
							/>
						</div>
					</div>
				</>
			)}
			{values.siteStructure?.structurePosition &&
				values.siteStructure?.structurePosition !== PositionValues.none && (
					<div className="row u-margin-top">
						<div className="col-xs-12">
							<FormikMultilanguageField
								siteStructurePosition={siteStructurePosition}
								handleClearInput={handleClearInput}
								handlePositionOnChange={handlePositionOnChange}
								siteId={siteId}
								treeConfig={treeConfig}
								asComponent={ContentTypeStructureCascader}
								label={tModule(MODULE_TRANSLATIONS.DEFAULT_POSITION)}
								name="siteStructure.position"
								placeholder={tModule(MODULE_TRANSLATIONS.SELECT_POSITION)}
								required={
									values.siteStructure?.structurePosition ===
									PositionValues.limited
								}
							/>
							{values.siteStructure?.structurePosition === PositionValues.limited && (
								<div className="u-margin-top-xs">
									<Field
										as={Checkbox}
										checked={values.siteStructure?.editablePosition}
										disabled={!siteStructuresRights.update}
										id="editable"
										name="siteStructure.editablePosition"
										label={tModule(MODULE_TRANSLATIONS.EDITABLE)}
										onChange={onEditableToggle}
									/>
								</div>
							)}
						</div>
					</div>
				)}
		</div>
	);
};

export default ContentTypeDetailSiteStructure;
