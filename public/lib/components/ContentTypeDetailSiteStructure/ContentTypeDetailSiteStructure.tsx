import { Button, Checkbox, RadioGroup } from '@acpaas-ui/react-components';
import { Cascader, LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import {
	FormikMultilanguageField,
	FormikMultilanguageFieldProps,
	LoadingState,
} from '@redactie/utils';
import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { isNil, pathOr } from 'ramda';
import React, { ChangeEvent, FC, useContext, useEffect, useMemo, useState } from 'react';

import sitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { findPosition, getPositionInputValue, getTreeConfig } from '../../helpers';
import { useContentTypeSiteStructureItems, useSiteStructure } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CONFIG, PositionValues, SITE_STRUCTURE_POSITION_OPTIONS } from '../../navigation.const';
import { CascaderOption, NavItem, NavTree } from '../../navigation.types';
import { SiteStructure } from '../../services/siteStructures';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';
import { siteStructuresFacade } from '../../store/siteStructures';

const ContentTypeDetailSiteStructure: FC<ExternalTabProps> = ({ siteId, contentType }) => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values, setFieldValue } = useFormikContext<FormikValues>();
	const { activeLanguage } = useContext(LanguageHeaderContext);
	const [loadingState, siteStructures] = useSiteStructures();
	const { fetchingState, siteStructure } = useSiteStructure();
	const [, contentTypeSiteStructureItems] = useContentTypeSiteStructureItems();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [siteStructureForLang, setSiteStructureForLang] = useState<SiteStructure | null>(null);
	const siteStructureItem = useMemo(() => {
		return contentTypeSiteStructureItems?.find(item => item.treeId === siteStructure?.id);
	}, [contentTypeSiteStructureItems, siteStructure]);

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

		setSiteStructureForLang(siteStructures.find(i => i.lang === activeLanguage.key) || null);
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

		setFieldValue(`tempSiteStructurePosition.${activeLanguage.key}`, position);
	}, [activeLanguage.key, contentType, setFieldValue, siteId, treeConfig]);

	const setItem = (): void => {
		if (siteStructureItem) {
			setFieldValue(
				`updatedSiteStructurePosition.${activeLanguage.key}.itemId`,
				siteStructureItem.id
			);
			setFieldValue(
				`updatedSiteStructurePosition.${activeLanguage.key}.position`,
				siteStructureItem.parentId
			);
		}

		setFieldValue(
			`updatedSiteStructurePosition.${activeLanguage.key}.treeId`,
			siteStructure?.id
		);
	};

	const handlePositionOnChange = (value: number[]): void => {
		const parentId = value.slice(-1)[0];

		setItem();
		setFieldValue(`tempSiteStructurePosition.${activeLanguage.key}`, value);
		setFieldValue(`updatedSiteStructurePosition.${activeLanguage.key}.position`, parentId);
		setFieldValue(`siteStructure.position.${activeLanguage.key}`, parentId);
	};

	const onEditableToggle = (e: ChangeEvent<HTMLInputElement>): void => {
		setFieldValue('siteStructure.editablePosition', e.target.checked);

		if (!e.target.checked) {
			setItem();
		}
	};

	const onClearInput = (e: React.SyntheticEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		setItem();
		setFieldValue(`tempSiteStructurePosition.${activeLanguage.key}`, []);
		setFieldValue(`updatedSiteStructurePosition.${activeLanguage.key}.position`, null);
		setFieldValue(`siteStructure.position.${activeLanguage.key}`, null);
	};

	const renderCascader = (props: FormikMultilanguageFieldProps): React.ReactElement => {
		const value = pathOr([], ['tempSiteStructurePosition', activeLanguage.key])(values);
		const disabled =
			!treeConfig.options.length ||
			loadingState === LoadingState.Loading ||
			fetchingState === LoadingState.Loading;

		return (
			<div
				className={classNames('a-input has-icon-right', {
					'is-required': props.required,
					'has-error': pathOr(false, ['state', 'error'])(props),
				})}
				style={{ flexGrow: 1 }}
			>
				<label className="a-input__label" htmlFor="text-field">
					{props.label as string}
				</label>
				<small>{tModule(MODULE_TRANSLATIONS.CT_SITE_STRUCTURE_POSITION_DESCRIPTION)}</small>
				<Cascader
					changeOnSelect
					value={value}
					options={treeConfig.options}
					disabled={disabled}
					onChange={(value: number[]) => handlePositionOnChange(value)}
				>
					<div className="a-input__wrapper">
						<input
							onChange={() => null}
							disabled={disabled}
							placeholder={
								!treeConfig.options.length
									? tModule(MODULE_TRANSLATIONS.NO_OPTIONS_AVAILABLE)
									: tModule(MODULE_TRANSLATIONS.SELECT_TREE_POSITION)
							}
							value={getPositionInputValue(treeConfig.options, value)}
						/>

						{value.length > 0 && (
							<span
								className="fa"
								style={{
									pointerEvents: 'initial',
									cursor: 'pointer',
								}}
							>
								<Button
									icon="close"
									ariaLabel="Close"
									size="small"
									transparent
									style={{
										top: '-2px',
									}}
									onClick={onClearInput}
								/>
							</span>
						)}
					</div>
				</Cascader>
			</div>
		);
	};

	return (
		<div>
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
			{values.siteStructure?.structurePosition &&
				values.siteStructure?.structurePosition !== PositionValues.none && (
					<div className="row u-margin-top">
						<div className="col-xs-12">
							<FormikMultilanguageField
								asComponent={renderCascader}
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
