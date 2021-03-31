import { CardBody, Select, Spinner, Textarea, TextField } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import { CompartmentProps } from '@redactie/content-module';
import {
	DataLoader,
	ErrorMessage,
	FormikOnChangeHandler,
	LoadingState,
	useDidMount,
	useSiteContext,
} from '@redactie/utils';
import { Field, Formik, FormikProps, FormikValues } from 'formik';
import { isNil } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { isNotEmpty } from '../../helpers';
import { useNavigationRights, useTree, useTreeItem, useTreeOptions } from '../../hooks';
import { CascaderOption } from '../../navigation.types';
import { TreeDetailItem } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';
import { treesFacade } from '../../store/trees';

import {
	NAV_ITEM_STATUSES,
	STATUS_OPTIONS,
	VALIDATION_SCHEMA,
} from './ContentDetailCompartment.const';
import { findPosition, getPositionInputValue } from './contentDetailCompartment.helpers';

const ContentDetailCompartment: FC<CompartmentProps> = ({
	value = {},
	contentValue,
	contentItem,
	onChange,
	formikRef,
}) => {
	/**
	 * Hooks
	 */

	// Data hooks
	const [loadingTree, tree] = useTree(value.navigationTree);
	const { siteId } = useSiteContext();
	const treeItem = useTreeItem(value.id);
	const navigationRights = useNavigationRights(siteId);
	const treeConfig = useMemo<{
		options: CascaderOption[];
		activeItem: TreeDetailItem | undefined;
	}>(() => {
		if (tree) {
			let activeItem;
			const mapTreeItemsToOptions = (items: TreeDetailItem[]): CascaderOption[] => {
				return items
					.map((item: TreeDetailItem) => {
						// Filter out the current navigation item from the position list
						// The user can not set the current navigation item as the position in the
						// navigation tree because it will create a circular dependency
						if (item.id === parseInt(value.id, 10)) {
							activeItem = item;
							return null;
						}
						return {
							value: item.id,
							label: item.label,
							children: mapTreeItemsToOptions(item.items || []),
						};
					})
					.filter(item => item !== null) as CascaderOption[];
			};
			return {
				options: mapTreeItemsToOptions(tree.items || []),
				activeItem,
			};
		}
		return {
			options: [],
			activeItem: undefined,
		};
	}, [tree, value.id]);
	const initialValues = useMemo(
		() => ({
			id: value.id ?? '',
			navigationTree: value.navigationTree ?? '',
			position:
				!isNil(treeItem?.parentId) && treeConfig.options.length > 0
					? findPosition(treeConfig.options, treeItem?.parentId)
					: value.position
					? value.position
					: [],
			label: treeItem?.label ?? value.label ?? '',
			description: treeItem?.description ?? value.description ?? '',
			status: treeItem?.publishStatus ?? value.status ?? STATUS_OPTIONS[0].value,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[treeItem, treeConfig.options]
	);
	const readonlyNavigationTree = useMemo(() => {
		return initialValues.id !== ''
			? !navigationRights.update && !navigationRights.delete
			: !navigationRights.create;
	}, [
		initialValues.id,
		navigationRights.create,
		navigationRights.delete,
		navigationRights.update,
	]);
	const [loadingTreesOptions, treesOptions] = useTreeOptions(navigationRights, initialValues.id);
	const [initialLoading, setInitialLoading] = useState(true);
	const activeTreeItemHasChildItems = useMemo<boolean>(() => {
		if (treeConfig.activeItem) {
			return (
				Array.isArray(treeConfig.activeItem.items) && treeConfig.activeItem.items.length > 0
			);
		}
		return false;
	}, [treeConfig.activeItem]);

	const readonly = useMemo(() => {
		return initialValues.id !== '' ? !navigationRights.update : !navigationRights.create;
	}, [initialValues.id, navigationRights.update, navigationRights.create]);

	const statusOptions = useMemo(() => {
		if (
			(contentValue?.meta.status === 'UNPUBLISHED' &&
				value.status !== NAV_ITEM_STATUSES.PUBLISHED) ||
			!contentItem?.meta?.historySummary?.published
		) {
			return STATUS_OPTIONS.filter(
				statusOption => statusOption.value !== NAV_ITEM_STATUSES.PUBLISHED
			);
		}
		return STATUS_OPTIONS;
	}, [contentItem, contentValue, value.status]);

	/**
	 * Fetch data effects
	 */
	useDidMount(() => {
		treesFacade.getTreesList(siteId);
	});

	useEffect(() => {
		if (
			initialLoading &&
			loadingTreesOptions !== LoadingState.Loading &&
			loadingTree !== LoadingState.Loading
		) {
			setInitialLoading(false);
		}
	}, [loadingTree, loadingTreesOptions, initialLoading]);

	useEffect(() => {
		const hasNavigationTree = isNotEmpty(value.navigationTree);
		const hasId = isNotEmpty(value.id);

		if (hasId && hasNavigationTree && treeItem?.id != value.id) {
			treeItemsFacade.fetchTreeItem(siteId, value.navigationTree, value.id);
		}
	}, [value.id, value.navigationTree, treeItem, value, siteId]);

	useEffect(() => {
		const hasNavigationTree = isNotEmpty(value.navigationTree);

		if (hasNavigationTree && tree?.id != value.navigationTree) {
			treesFacade.getTree(siteId, value.navigationTree);
		}
	}, [siteId, tree, value.navigationTree]);

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
		<Formik
			innerRef={instance => formikRef && formikRef(instance)}
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onChange}
			validationSchema={VALIDATION_SCHEMA}
		>
			{({ errors, touched, values, setFieldValue }) => {
				const navigationTreeSelected =
					values.navigationTree !== null &&
					values.navigationTree !== undefined &&
					values.navigationTree !== '';

				return (
					<>
						<FormikOnChangeHandler delay={300} onChange={onFormChange} />
						<CardBody>
							<h6 className="u-margin-bottom">Navigatie</h6>
							<div className="row">
								<div className="col-xs-12 col-sm-6">
									<Field
										as={Select}
										id="navigationTree"
										disabled={
											activeTreeItemHasChildItems || readonlyNavigationTree
										}
										name="navigationTree"
										label="Navigatieboom"
										placeholder="Selecteer een navigatieboom"
										onChange={(e: any): void => {
											const navigationTreeValue = e.target.value;
											setFieldValue('navigationTree', navigationTreeValue);
											setFieldValue('position', []);
										}}
										options={treesOptions}
									/>
									<small className="u-block u-text-light u-margin-top-xs">
										Selecteer een navigatieboom
									</small>
								</div>
								<div className="col-xs-12 col-sm-6">
									{navigationTreeSelected && loadingTree === LoadingState.Loaded && (
										<div className="a-input has-icon-right">
											<label className="a-input__label" htmlFor="text-field">
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
														disabled={readonly}
														placeholder="Kies een positie in de boom"
														value={getPositionInputValue(
															treeConfig.options,
															values.position
														)}
													/>

													{values.position?.length > 0 && (
														<span
															style={{
																pointerEvents: 'initial',
																cursor: 'pointer',
															}}
															onClick={(e: React.SyntheticEvent) => {
																e.preventDefault();
																e.stopPropagation();
																setFieldValue('position', []);
															}}
															className="fa fa-times-circle"
														/>
													)}
												</div>
											</Cascader>
											<small>
												Selecteer op welke plek je de pagina in de
												navigatieboom wilt hangen.
											</small>
										</div>
									)}
									{loadingTree === LoadingState.Loading && <Spinner />}
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
													!!touched.label && !!errors.label ? 'error' : ''
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
						</CardBody>
					</>
				);
			}}
		</Formik>
	);

	return <DataLoader loadingState={initialLoading} render={renderForm} />;
};

export default ContentDetailCompartment;
