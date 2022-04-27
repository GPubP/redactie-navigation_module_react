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
import {
	getAvailableSiteStructureOptions,
	getCTStructureConfig,
	getLangSiteUrl,
	getPositionInputValue,
	getTreeConfig,
} from '../../helpers';
import { useNavigationRights, useSiteStructure } from '../../hooks';
import { useSiteStructures } from '../../hooks/useSiteStructures';
import { CONFIG, PositionValues } from '../../navigation.const';
import { NavItem, NavTree } from '../../navigation.types';
import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

const ContentDetailNavigationStructureCompartment: FC<CompartmentProps> = ({
	updateContentMeta,
	contentValue,
	contentItem,
	activeLanguage,
	value,
	onChange,
	site,
	formikRef,
	contentType,
}) => {
	const url = getLangSiteUrl(site, activeLanguage);
	const CTStructureConfig = getCTStructureConfig(contentType, activeLanguage!, CONFIG.name, site);
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
		console.log(value);
		// setFieldValue(`sitestructuur.position.${activeLanguage}`, value);
	};

	const renderCTStructure = (positionValue: string): React.ReactElement | null => {
		if (positionValue === '') {
			return null;
		}

		return <span className="u-margin-right-xs">{`${positionValue} >`}</span>;
	};

	const renderCascader = (props: FormikMultilanguageFieldProps): React.ReactElement => {
		// selected value in cascader = number[]
		const cascaderValue = pathOr([], ['sitestructuur', 'position', activeLanguage!])(value);
		// CT structure config = number[]
		const ctStructureValue = pathOr([], ['position', activeLanguage!])(CTStructureConfig);
		// CT structure > string
		const ctPositionValue = getPositionInputValue(treeConfig.options as any, ctStructureValue);
		// CT structure position oneof PositionValues
		const structurePosition = pathOr(PositionValues.none, ['structurePosition'])(
			CTStructureConfig
		);
		// available positions after ctPositionValue = number[]
		const availablePositions =
			structurePosition === PositionValues.limited
				? cascaderValue.slice(ctStructureValue.length)
				: cascaderValue;
		// available sitestructure when limited position
		const availableLimitedSiteStructure = getAvailableSiteStructureOptions(
			ctStructureValue,
			siteStructure
		);
		// available sitestructure when limited position
		const availableLimitedTreeConfig = getTreeConfig<NavTree, NavItem>(
			(availableLimitedSiteStructure as unknown) as NavTree,
			availableLimitedSiteStructure?.id as number
		);

		const disabled =
			(structurePosition === PositionValues.limited &&
				(!availableLimitedTreeConfig.options.length ||
					!CTStructureConfig.editablePosition)) ||
			!treeConfig.options.length;

		return (
			<div
				className={classNames('a-input has-icon-right u-margin-bottom', {
					'is-required': props.required,
					'has-error': pathOr(false, ['state', 'error'])(props),
				})}
				style={{ flexGrow: 1 }}
			>
				<label
					className={classNames('a-input__label', {
						'u-no-margin':
							structurePosition === PositionValues.limited &&
							!CTStructureConfig.editablePosition,
					})}
					htmlFor="text-field"
				>
					{props.label as string}
				</label>
				{structurePosition === PositionValues.limited &&
					!CTStructureConfig.editablePosition && (
						<small>Bepaal de positie van dit item.</small>
					)}
				<div className="u-flex u-flex-align-center">
					{structurePosition === PositionValues.limited &&
						CTStructureConfig.editablePosition &&
						renderCTStructure(ctPositionValue)}
					<Cascader
						changeOnSelect
						value={
							structurePosition === PositionValues.limited &&
							!CTStructureConfig.editablePosition
								? ctStructureValue
								: availablePositions
						}
						options={
							structurePosition === PositionValues.limited &&
							CTStructureConfig.editablePosition
								? availableLimitedTreeConfig.options
								: treeConfig.options
						}
						disabled={disabled}
						onChange={(value: number[]) =>
							handlePositionOnChange(
								structurePosition === PositionValues.limited &&
									CTStructureConfig.editablePosition
									? [...ctStructureValue, ...value]
									: value
							)
						}
					>
						<div className="a-input__wrapper u-flex-item">
							<input
								onChange={() => null}
								disabled={disabled}
								placeholder={props.placeholder as string}
								value={getPositionInputValue(
									treeConfig.options as any,
									structurePosition === PositionValues.limited &&
										!CTStructureConfig.editablePosition
										? ctStructureValue
										: availablePositions
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
