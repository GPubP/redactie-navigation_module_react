/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CardBody, Textarea, TextField } from '@acpaas-ui/react-components';
import { Button, Cascader, LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import { CompartmentProps, ContentSchema } from '@redactie/content-module';
import { ContentMeta } from '@redactie/content-module/dist/lib/services/content';
import {
	CascaderOption,
	FormikMultilanguageFieldProps,
	FormikOnChangeHandler,
	useSiteContext,
} from '@redactie/utils';
import classNames from 'classnames';
import { Field, Formik, FormikBag, FormikValues, useFormikContext } from 'formik';
import { path, pathOr } from 'ramda';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import contentConnector from '../../connectors/content';
import { getLangSiteUrl, getPositionInputValue, getTreeConfig } from '../../helpers';
import { useNavigationRights, useSiteStructure } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { CONFIG } from '../../navigation.const';
import { NavItem, NavTree } from '../../navigation.types';
import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

const ContentTypeDetailUrl: FC<CompartmentProps> = ({
	updateContentMeta,
	contentValue,
	contentItem,
	activeLanguage,
	value,
	onChange,
	site,
	formikRef,
}) => {
	const url = getLangSiteUrl(site, activeLanguage);
	const newSite = url?.slice(-1) === '/' ? url.slice(0, url.length - 1) : url;
	const [loadingState, siteStructures] = useSiteStructures();
	const { fetchingState, siteStructure } = useSiteStructure();
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

	const handlePositionOnChange = (value: number[]): void => {
		// setFieldValue(`sitestructuur.position.${activeLanguage}`, value);
	};

	const renderCascader = (props: FormikMultilanguageFieldProps): React.ReactElement => {
		const cascaderValue = pathOr([], ['sitestructuur', 'position', activeLanguage!])(value);

		console.log({ treeConfig, siteStructure, cascaderValue, value });

		const disabled = false;

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
				<small className="u-block u-text-light u-margin-top-xs">
					Bepaal de positie van dit item.
				</small>
				<div className="u-flex u-flex-align-center">
					<span>test</span>
					<Cascader
						changeOnSelect
						value={cascaderValue}
						options={treeConfig.options}
						disabled={disabled}
						onChange={(value: number[]) => handlePositionOnChange(value)}
					>
						<div className="a-input__wrapper u-flex-item">
							<input
								onChange={() => null}
								disabled={disabled}
								placeholder={props.placeholder as string}
								value={getPositionInputValue(
									treeConfig.options as any,
									cascaderValue
								)}
							/>

							{/* {cascaderValue.length > 0 && (
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
									onClick={(e: React.SyntheticEvent) => {
										e.preventDefault();
										e.stopPropagation();
										// setFieldValue('sitestructuur.position', []);
									}}
								/>
							</span>
						)} */}
						</div>
					</Cascader>
				</div>
			</div>
		);
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
									as={renderCascader}
									id="position"
									name="position"
									label="Positie"
									required={true}
									placeholder="Selecteer een positie"
								/>
								<div className="a-input has-icon-right">
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
							</CardBody>
						</>
					);
				}}
			</Formik>
		</>
	);
};

export default ContentTypeDetailUrl;
