import {
	Button,
	CardBody,
	Checkbox,
	Select,
	Spinner,
	Textarea,
	TextField,
} from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import { CompartmentProps, ModuleValue } from '@redactie/content-module';
import { DataLoader, ErrorMessage, FormikOnChangeHandler, useSiteContext } from '@redactie/utils';
import { Field, FieldProps, Formik, FormikBag, FormikProps, FormikValues } from 'formik';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import translationsConnector from '../../connectors/translations';
import { getPositionInputValue, getTreeConfig } from '../../helpers';
import { useNavigationRights, useTree, useTreeItem, useTreeOptions } from '../../hooks';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';
import { CascaderOption } from '../../navigation.types';
import { TreeDetailItem } from '../../services/trees';
import { ReplaceConfirmModal } from '../ReplaceConfirmModal';

import { VALIDATION_SCHEMA } from './ContentDetailCompartment.const';
import {
	getInitialFormValues,
	getStatusOptions,
	hasTreeItemHasChildItems,
} from './contentDetailCompartment.helpers';

const ContentDetailCompartment: FC<CompartmentProps> = ({
	value = {},
	contentValue,
	contentItem,
	onChange,
	formikRef,
}) => {
	const contentValueStatus = contentValue?.meta.status;
	const contentValueIsPublished = contentValue?.meta.historySummary?.published;

	/**
	 * Hooks
	 */
	// Context hooks
	const { siteId } = useSiteContext();

	// Data hooks
	const [loadingTree, tree] = useTree(value.navigationTree);
	const [loadingTreeItem, treeItem, treeItemError] = useTreeItem(value.navigationTree, value.id);
	const navigationRights = useNavigationRights(siteId);
	const [tModule] = translationsConnector.useModuleTranslation();

	// Local state hooks
	const [initialLoading, setInitialLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const internalFormRef = useRef<FormikBag<any, any>>(null);
	const treeConfig = useMemo<{
		options: CascaderOption[];
		activeItem: TreeDetailItem | undefined;
	}>(() => getTreeConfig(tree, value.id), [tree, value.id]);
	const contentItemOldNavigation = useMemo<ModuleValue | null>(
		() =>
			treeItemError?.message === 'NotFound'
				? null
				: (contentItem?.modulesData?.navigation as ModuleValue),
		[contentItem, treeItemError]
	);
	const initialValues = useMemo(
		() =>
			getInitialFormValues(
				value,
				treeItem,
				treeConfig.options,
				treeItemError?.message === 'NotFound'
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[treeItem, treeItem?.publishStatus, treeConfig.options, treeItemError]
	);
	const [loadingTreesOptions, treesOptions] = useTreeOptions(navigationRights, initialValues.id);
	const activeTreeItemHasChildItems = useMemo(
		() => hasTreeItemHasChildItems(treeConfig.activeItem),
		[treeConfig.activeItem]
	);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const statusOptions = useMemo(() => getStatusOptions(contentItem, contentValue, value.status), [
		contentItem,
		contentValueIsPublished,
		contentValueStatus,
		contentValue,
		value.status,
	]);

	// Initial loading hooks
	useEffect(() => {
		if (initialLoading && !loadingTreesOptions && !loadingTree && !loadingTreeItem) {
			setInitialLoading(false);
		}
	}, [loadingTree, loadingTreesOptions, initialLoading, loadingTreeItem]);

	// Form state Hooks
	const readonlyNavigationTree = useMemo(() => {
		return initialValues.id !== ''
			? !navigationRights.update && !navigationRights.delete
			: !navigationRights.create;
	}, [initialValues.id, navigationRights]);

	const readonly = useMemo(() => {
		return initialValues.id !== '' ? !navigationRights.update : !navigationRights.create;
	}, [initialValues.id, navigationRights.update, navigationRights.create]);

	/**
	 * Functions
	 */
	const onFormChange = (values: FormikValues): void => {
		onChange(values);
	};

	const handlePositionOnChange = (
		value: number[],
		setFieldValue: FormikProps<FormikValues>['setFieldValue']
	): void => {
		setFieldValue('position', value);
	};

	/**
	 * Render
	 */
	const renderForm = (): ReactElement => (
		<>
			<Formik
				innerRef={instance => {
					(internalFormRef as any).current = instance;
					formikRef && formikRef(instance);
				}}
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onChange}
				validationSchema={VALIDATION_SCHEMA}
			>
				{({ errors, touched, values, setFieldValue }) => {
					const navigationTreeSelected =
						values.navigationTree !== null &&
						values.navigationTree !== undefined &&
						values.navigationTree !== '' &&
						!!Object.keys(values.navigationTree).length;

					const navigationItemSelected =
						Array.isArray(values.position) && !!values.position.length;

					return (
						<>
							<FormikOnChangeHandler onChange={onFormChange} />
							<CardBody>
								<h2 className="h3 u-margin-bottom">Navigatie</h2>
								<div className="row">
									<div className="col-xs-12 col-sm-6">
										<Field
											as={Select}
											id="navigationTree"
											disabled={
												activeTreeItemHasChildItems ||
												readonlyNavigationTree
											}
											name="navigationTree"
											label="Navigatieboom"
											placeholder="Selecteer een navigatieboom"
											onChange={(e: any): void => {
												const navigationTreeValue = e.target.value;
												setFieldValue(
													'navigationTree',
													navigationTreeValue
												);
												setFieldValue('position', []);
											}}
											options={treesOptions}
										/>
										<small className="u-block u-text-light u-margin-top-xs">
											Selecteer een navigatieboom
										</small>
									</div>
								</div>
								<div className="row u-margin-top">
									<div className="col-xs-12 col-sm-6">
										{navigationTreeSelected && !loadingTree && (
											<div className="a-input has-icon-right">
												<label
													className="a-input__label"
													htmlFor="text-field"
												>
													Positie
												</label>
												<Cascader
													changeOnSelect
													disabled={readonly}
													value={values.position}
													options={treeConfig.options}
													onChange={(value: number[]) =>
														handlePositionOnChange(value, setFieldValue)
													}
												>
													<div className="a-input__wrapper">
														<input
															onChange={() => null}
															disabled={
																readonly ||
																!treeConfig.options.length
															}
															placeholder={
																!treeConfig.options.length
																	? tModule(
																			MODULE_TRANSLATIONS.NO_OPTIONS_AVAILABLE
																	  )
																	: tModule(
																			MODULE_TRANSLATIONS.SELECT_TREE_POSITION
																	  )
															}
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
																	transparent
																	style={{
																		top: '-2px',
																	}}
																	onClick={(
																		e: React.SyntheticEvent
																	) => {
																		e.preventDefault();
																		e.stopPropagation();
																		setFieldValue(
																			'position',
																			[]
																		);
																	}}
																/>
															</span>
														)}
													</div>
												</Cascader>
												<small>
													{tModule(
														MODULE_TRANSLATIONS.SITE_STRUCTURE_POSITION_DESCRIPTION
													)}
												</small>
											</div>
										)}
										{loadingTree && <Spinner />}
									</div>
								</div>

								{navigationTreeSelected && (
									<div>
										<div className="row u-margin-top">
											<div className="col-xs-12 col-sm-6">
												<Field
													as={TextField}
													description="Geef een naam of 'label' op voor dit item."
													id="label"
													name="label"
													label="Label"
													disabled={readonly}
													state={
														!!touched.label && !!errors.label
															? 'error'
															: ''
													}
													required
												/>
												<ErrorMessage name="label" />
											</div>
											<div className="col-xs-12 col-sm-6">
												<Field
													as={Select}
													id="status"
													name="status"
													label="Status"
													required
													disabled={readonly}
													options={statusOptions}
												/>
												<small className="u-block u-text-light u-margin-top-xs">
													Selecteer een status
												</small>
												<ErrorMessage name="status" />
											</div>
										</div>
										<div className="u-margin-top">
											<Field
												as={Textarea}
												id="description"
												name="description"
												label="Beschrijving"
												placeholder="Typ een beschrijving"
												disabled={readonly}
											/>
											<small className="u-block u-text-light u-margin-top-xs">
												Geef dit item een korte beschrijving.
											</small>
										</div>
									</div>
								)}

								{!contentItemOldNavigation?.navigationTree &&
									navigationRights.replace &&
									navigationTreeSelected &&
									navigationItemSelected &&
									!Object.keys(errors).length && (
										<div className="row u-margin-top">
											<div className="col-xs-12 u-no-margin">
												<Field id="replaceItem" name="replaceItem">
													{({ field, form }: FieldProps) => (
														<Checkbox
															id="replaceItem"
															name="replaceItem"
															label="Vervang het navigatie item"
															checked={field.value}
															onChange={() => {
																form.setFieldValue(
																	'replaceItem',
																	!field.value
																);
																!field.value && setShowModal(true);
															}}
														/>
													)}
												</Field>
											</div>
										</div>
									)}
							</CardBody>
						</>
					);
				}}
			</Formik>
			<ReplaceConfirmModal
				show={showModal}
				onConfirm={() => setShowModal(false)}
				onCancel={() => {
					internalFormRef.current?.setFieldValue('replaceItem', false);
					setShowModal(false);
				}}
			/>
		</>
	);

	return <DataLoader loadingState={initialLoading} render={renderForm} />;
};

export default ContentDetailCompartment;
