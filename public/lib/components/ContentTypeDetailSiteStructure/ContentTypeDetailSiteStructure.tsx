import { Checkbox, RadioGroup, TextField } from '@acpaas-ui/react-components';
import { Cascader, LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/content-module';
import {
	FormikMultilanguageField,
	FormikMultilanguageFieldProps,
	LoadingState,
} from '@redactie/utils';
import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { pathOr } from 'ramda';
import React, { ChangeEvent, FC, useContext, useEffect, useMemo, useState } from 'react';

import sitesConnector from '../../connectors/sites';
import translationsConnector from '../../connectors/translations';
import { getPositionInputValue, getTreeConfig } from '../../helpers';
import { useSiteStructure } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { SITE_STRUCTURE_POSITION_OPTIONS } from '../../navigation.const';
import { CascaderOption, NavItem, NavTree } from '../../navigation.types';
import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';
const ContentTypeDetailSiteStructure: FC<ExternalTabProps> = ({ siteId }) => {
	const [tModule] = translationsConnector.useModuleTranslation();
	const { values, errors, setFieldValue } = useFormikContext<FormikValues>();
	const { activeLanguage } = useContext(LanguageHeaderContext);
	const [loadingState, siteStructures] = useSiteStructures();
	const { fetchingState, siteStructure } = useSiteStructure();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [siteStructureForLang, setSiteStructureForLang] = useState<SiteStructure | null>(null);

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

	const handlePositionOnChange = (value: number[]): void => {
		setFieldValue(`sitestructuur.position.${activeLanguage.key}`, value);
	};

	const renderCascader = (props: FormikMultilanguageFieldProps): React.ReactElement => {
		return (
			<div
				className={classNames('a-input has-icon-right', { 'is-required': props.required })}
				style={{ flexGrow: 1 }}
			>
				<label className="a-input__label" htmlFor="text-field">
					{props.label as string}
				</label>
				<small>Bepaal de standaardpositie voor items van dit content type.</small>
				<Cascader
					changeOnSelect
					value={siteStructure?.id}
					options={treeConfig.options}
					onChange={(value: number[]) => handlePositionOnChange(value)}
				>
					<TextField
						state={props.state}
						onChange={() => null}
						disabled={
							!treeConfig.options.length ||
							loadingState === LoadingState.Loading ||
							fetchingState === LoadingState.Loading
						}
						placeholder={props.placeholder as string}
						value={getPositionInputValue(
							treeConfig?.options,
							pathOr([], ['sitestructuur', 'position', activeLanguage.key])(values)
						)}
					/>
				</Cascader>
			</div>
		);
	};

	return (
		<div>
			<div className="u-margin-bottom">
				<h2 className="h3 u-margin-bottom">
					{tModule(MODULE_TRANSLATIONS.NAVIGATION_SITE_STRUCTURE_TITLE)}
				</h2>
				<p>{tModule(MODULE_TRANSLATIONS.NAVIGATION_SITE_STRUCTURE_DESCRIPTION)}</p>
			</div>
			<div className="row">
				<div className="col-xs-12">
					<Field
						as={RadioGroup}
						id="structurePosition"
						name="sitestructuur.structurePosition"
						options={SITE_STRUCTURE_POSITION_OPTIONS}
						value={
							values.sitestructuur?.structurePosition ||
							SITE_STRUCTURE_POSITION_OPTIONS[0].value
						}
					/>
				</div>
			</div>
			{values.sitestructuur?.structurePosition &&
				values.sitestructuur?.structurePosition !== 'none' && (
					<div className="row u-margin-top">
						<div className="col-xs-12">
							<FormikMultilanguageField
								asComponent={renderCascader}
								label="Standaard positie"
								name="sitestructuur.position"
								placeholder="Selecteer een positie"
								//required={values.sitestructuur?.structurePosition === 'limited'}
								state={
									activeLanguage &&
									values.sitestructuur?.structurePosition === 'limited' &&
									pathOr(
										null,
										['sitestructuur', 'position', activeLanguage.key],
										errors
									) &&
									'error'
								}
							/>
							{values.sitestructuur?.structurePosition === 'limited' && (
								<div className="u-margin-top-xs">
									<Field
										as={Checkbox}
										checked={values.sitestructuur?.editablePosition}
										id="editable"
										name="sitestructuur.editablePosition"
										label="Aanpasbaar"
										onChange={(e: ChangeEvent<HTMLInputElement>) => {
											setFieldValue(
												'sitestructuur.editablePosition',
												e.target.checked
											);
										}}
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
