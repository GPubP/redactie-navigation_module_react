import { Button, Checkbox, Switch, Textarea, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Cascader,
} from '@acpaas-ui/react-editorial-components';
import { ContentModel } from '@redactie/content-module';
import { InputFieldProps } from '@redactie/form-renderer-module';
import { ErrorMessage, FormikOnChangeHandler, LeavePrompt, LoadingState } from '@redactie/utils';
import { Field, FieldProps, Formik, FormikProps, FormikValues } from 'formik';
import React, { ChangeEvent, FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import formRendererConnector from '../../connectors/formRenderer';
import sitesConnector from '../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import {
	getInitialNavItemsFormValues,
	getLangSiteUrl,
	getPositionInputValue,
	getTreeConfig,
} from '../../helpers';
import { extractSiblings } from '../../helpers/extractSiblings';
import {
	CascaderOption,
	NavItem,
	NavItemDetailForm,
	NavTree,
	RearrangeNavItem,
} from '../../navigation.types';
import { NAV_STATUSES } from '../ContentDetailCompartment';
import { RearrangeModal } from '../RearrangeModal';

import { NAV_ITEM_SETTINGS_VALIDATION_SCHEMA } from './NavItemDetailForm.const';
import { NavItemDetailFormProps } from './NavItemDetailForm.types';

const NavItemDetailForm: FC<NavItemDetailFormProps> = ({
	navItem,
	navItems,
	navTree,
	rights,
	loading,
	upsertingState,
	parentChanged,
	isChanged,
	copy,
	onRearrange,
	onChange,
	onSave,
}) => {
	const { siteId } = useParams<{ siteId: string }>();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [contentItemPublished, setContentItemPublished] = useState(false);
	const [showRearrange, setShowRearrange] = useState(false);
	const [sortRows, setSortRows] = useState<NavItem[]>([]);
	const [t] = translationsConnector.useCoreTranslation();

	const canEdit = useMemo(() => {
		return navItem?.id ? rights?.canUpdate : true;
	}, [navItem, rights]);

	const isUpdate = useMemo(() => {
		return !!navItem?.id;
	}, [navItem]);

	const treeConfig = useMemo<{
		options: CascaderOption[];
		activeItem: NavItem | undefined;
	}>(() => getTreeConfig<NavTree, NavItem>(navTree, navItem?.id as number), [navItem, navTree]);

	const initialValues: NavItemDetailForm = useMemo(() => {
		if (!navItem) {
			return {} as NavItemDetailForm;
		}

		setContentItemPublished(navItem.publishStatus === NAV_STATUSES.PUBLISHED);
		return getInitialNavItemsFormValues(navItem, treeConfig.options);
	}, [navItem, treeConfig.options]);

	const ContentSelect: React.FC<InputFieldProps> | null | undefined = useMemo(() => {
		const fieldRegistry = formRendererConnector.api.fieldRegistry;

		if (!fieldRegistry) {
			return null;
		}

		return fieldRegistry.get('content', 'contentReference')?.component;
	}, []);

	const handlePositionOnChange = (
		value: number[],
		setFieldValue: FormikProps<FormikValues>['setFieldValue']
	): void => {
		setFieldValue('position', value);
	};

	const openRearrangeModal = (): void => {
		setShowRearrange(true);
		setSortRows(extractSiblings(navItem?.id as number, navItems as NavItem[]));
	};

	const handleRearrange = async (items: RearrangeNavItem[]): Promise<void> => {
		await onRearrange(items);
		setShowRearrange(false);
	};

	if (!ContentSelect) {
		return null;
	}

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onSave}
			validationSchema={NAV_ITEM_SETTINGS_VALIDATION_SCHEMA}
		>
			{({ values, errors, submitForm, resetForm, getFieldHelpers, setFieldValue }) => {
				return (
					<>
						<FormikOnChangeHandler
							onChange={(values: FormikValues) => onChange(values)}
						/>
						{copy.description && <p className="u-margin-bottom">{copy.description}</p>}
						<div className="row">
							<div className="col-xs-12 col-md-6">
								<Field
									as={TextField}
									disabled={!canEdit}
									label="Label"
									name="label"
									required
									state={errors.label && 'error'}
								/>
								<ErrorMessage name="label" />
								<small className="u-block u-margin-top-xs">{copy.label}</small>
							</div>
							<div className="col-xs-12 col-md-6">
								<Field name="slug">
									{(fieldProps: FieldProps<any, {}>) => {
										return (
											<ContentSelect
												key={values.slug}
												fieldProps={fieldProps}
												fieldHelperProps={{
													...getFieldHelpers('slug'),
													setValue: (value: ContentModel) => {
														setFieldValue('slug', value?.meta.slug?.nl);
														setFieldValue(
															'publishStatus',
															value?.meta.published
																? NAV_STATUSES.PUBLISHED
																: NAV_STATUSES.DRAFT
														);
														setContentItemPublished(
															!!value?.meta.published
														);

														if (
															value?.meta.urlPath?.[value?.meta.lang]
																?.value
														) {
															setFieldValue(
																'externalUrl',
																`${getLangSiteUrl(
																	site,
																	value?.meta.lang
																)}${
																	value?.meta.urlPath?.[
																		value?.meta.lang
																	]?.value
																}`
															);
														}

														if (!values?.label) {
															setFieldValue(
																'label',
																value?.meta.label
															);
														}

														// This will not work until fields are returned by the content select
														// TODO: see if we should return fields because of this
														if (
															!values?.description &&
															value?.fields?.teaser?.text
														) {
															setFieldValue(
																'description',
																value.fields.teaser.text
															);
														}
													},
												}}
												fieldSchema={
													{
														label: 'Link',
														name: 'slug',
														config: {
															returnByValue: true,
															disabled: !canEdit,
															bySlug: true,
															required: true,
														},
													} as any
												}
											/>
										);
									}}
								</Field>
								<small className="u-block u-margin-top-xs">
									Zoek en selecteer een content item
								</small>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<div className="u-flex u-flex-align-end">
									<div
										className="a-input has-icon-right is-required"
										style={{ flexGrow: 1 }}
									>
										<label className="a-input__label" htmlFor="text-field">
											Positie
										</label>
										<Cascader
											changeOnSelect
											value={navItem?.parentId}
											options={treeConfig.options}
											onChange={(value: number[]) =>
												handlePositionOnChange(value, setFieldValue)
											}
										>
											<div className="a-input__wrapper">
												<input
													onChange={() => null}
													disabled={
														!canEdit || !treeConfig.options.length
													}
													placeholder="Kies een positie in de boom"
													value={getPositionInputValue(
														treeConfig.options,
														values.position
													)}
												/>

												{values.position?.length > 0 && (
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
															disabled={!canEdit}
															transparent
															style={{
																top: '-2px',
															}}
															onClick={(e: React.SyntheticEvent) => {
																e.preventDefault();
																e.stopPropagation();
																setFieldValue('position', []);
															}}
														></Button>
													</span>
												)}
											</div>
										</Cascader>
									</div>
									{isUpdate && !parentChanged && (
										<Button
											className="u-margin-left-xs"
											disabled={!canEdit}
											onClick={openRearrangeModal}
											type="primary"
										>
											Sorteren
										</Button>
									)}
								</div>
								<ErrorMessage name="description" />
								<small className="u-block u-margin-top-xs">
									Selecteer op welke plek in de boom je dit item wilt hangen.
								</small>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12">
								<Field
									as={Textarea}
									disabled={!canEdit}
									label="Beschrijving"
									name="description"
									state={errors.description && 'error'}
								/>
								<ErrorMessage name="description" />
								<small className="u-block u-margin-top-xs">
									Geef dit item een korte beschrijving.
								</small>
							</div>
						</div>
						{values.slug && (
							<div className="row u-margin-top">
								<div className="col-xs-12">
									<label className="u-block u-margin-bottom-xs">Status</label>
									<Field
										key={values.publishStatus}
										as={Switch}
										checked={values?.publishStatus === NAV_STATUSES.PUBLISHED}
										labelFalse="Uit"
										labelTrue="Aan"
										id="publishStatus"
										disabled={!canEdit || !contentItemPublished}
										name="publishStatus"
										label=""
										onClick={(e: ChangeEvent<HTMLInputElement>) => {
											setFieldValue(
												'publishStatus',
												e.target.checked
													? NAV_STATUSES.PUBLISHED
													: NAV_STATUSES.DRAFT
											);
										}}
									/>
									{!contentItemPublished && (
										<div className="u-margin-top-xs">
											<Field
												as={Checkbox}
												checked={
													values?.publishStatus === NAV_STATUSES.READY
												}
												id="readyStatus"
												disabled={!canEdit}
												name="publishStatus"
												label={copy.statusCheckbox}
												onChange={(e: ChangeEvent<HTMLInputElement>) => {
													setFieldValue(
														'publishStatus',
														e.target.checked
															? NAV_STATUSES.READY
															: NAV_STATUSES.DRAFT
													);
												}}
											/>
										</div>
									)}
									<small className="u-block u-margin-top-xs">
										Je kan de status bewerken indien het content item online is
									</small>
									<ErrorMessage name="publishStatus" />
								</div>
							</div>
						)}
						<ActionBar className="o-action-bar--fixed" isOpen={canEdit}>
							<ActionBarContentSection>
								<div className="u-wrapper row end-xs">
									<Button
										className="u-margin-right-xs"
										onClick={resetForm}
										negative
									>
										{navItem?.id
											? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
											: t(CORE_TRANSLATIONS.BUTTON_BACK)}
									</Button>
									<Button
										iconLeft={loading ? 'circle-o-notch fa-spin' : null}
										disabled={loading || !isChanged}
										onClick={submitForm}
										type="success"
									>
										{navItem?.id
											? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
											: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
						<LeavePrompt
							when={isChanged}
							shouldBlockNavigationOnConfirm
							onConfirm={submitForm}
						/>
						<RearrangeModal
							items={sortRows}
							show={showRearrange}
							loading={upsertingState === LoadingState.Loading}
							onCancel={() => setShowRearrange(false)}
							onConfirm={handleRearrange}
						/>
					</>
				);
			}}
		</Formik>
	);
};

export default NavItemDetailForm;
