import { Select, Spinner, Textarea, TextField } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import { CompartmentProps } from '@redactie/content-module';
import {
	DataLoader,
	ErrorMessage,
	FormikOnChangeHandler,
	LoadingState,
	useDidMount,
} from '@redactie/utils';
import arrayTreeFilter from 'array-tree-filter';
import { Field, Formik, FormikProps, FormikValues } from 'formik';
import { isNil } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo } from 'react';

import { useTree, useTreeItem, useTreesOptions } from '../../hooks';
import { CascaderOption } from '../../navigation.types';
import { TreeDetailItem } from '../../services/trees';
import { treeItemsFacade } from '../../store/treeItems';
import { treesFacade } from '../../store/trees';

import {
	NAV_ITEM_STATUSES,
	STATUS_OPTIONS,
	VALIDATION_SCHEMA,
} from './ContentDetailCompartment.const';

const ContentDetailCompartment: FC<CompartmentProps> = ({
	value = {},
	contentValue,
	onChange,
	formikRef,
}) => {
	/**
	 * Hooks
	 */

	// Data hooks
	const [loadingTreesOptions, treesOptions] = useTreesOptions();
	const [loadingTree, tree] = useTree(value.navigationTree);
	const treeItem = useTreeItem(value.id);

	const findPosition = (treeOptions: CascaderOption[], treeItemId?: string): string[] => {
		const reduceTreeOptions = (options: CascaderOption[]): string[] => {
			return options.reduce((acc, option) => {
				if (option.value === treeItemId) {
					acc.push(option.value);
					return acc;
				}

				if (option.children && option.children.length > 0) {
					const childrenValue = reduceTreeOptions(option.children);

					if (childrenValue && childrenValue.length > 0) {
						return [option.value, ...childrenValue];
					}
				}

				return acc;
			}, [] as string[]);
		};

		return reduceTreeOptions(treeOptions);
	};

	const treeOptions = useMemo<CascaderOption[]>(() => {
		if (tree) {
			const mapTreeItemsToOptions = (items: TreeDetailItem[]): CascaderOption[] => {
				return items
					.map((item: TreeDetailItem) => {
						// Filter out the current navigation item from the position list
						// The user can not set the current navigation item as the position in the
						// navigation tree because it will create a circular dependency
						if (item.id === value.id) {
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
			return mapTreeItemsToOptions(tree.items || []);
		}
		return [];
	}, [tree, value.id]);

	const initialValues = useMemo(
		() => ({
			id: value.id ?? '',
			navigationTree: value.navigationTree ?? '',
			position:
				!isNil(treeItem?.parentId) && treeOptions.length > 0
					? findPosition(treeOptions, treeItem?.parentId)
					: value.position ?? [],
			label: treeItem?.label ?? value.label ?? '',
			description: treeItem?.description ?? value.description ?? '',
			status: treeItem?.publishStatus ?? value.status ?? STATUS_OPTIONS[0].value,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			contentValue,
			treeItem,
			treeOptions,
			value.description,
			value.id,
			value.label,
			value.navigationTree,
			value.status,
		]
	);

	const statusOptions = useMemo(() => {
		if (
			contentValue?.meta.status === 'UNPUBLISHED' &&
			value.status !== NAV_ITEM_STATUSES.PUBLISHED
		) {
			return STATUS_OPTIONS.filter(
				statusOption => statusOption.value !== NAV_ITEM_STATUSES.PUBLISHED
			);
		}
		return STATUS_OPTIONS;
	}, [contentValue, value.status]);

	/**
	 * Fetch data effects
	 */
	useDidMount(() => {
		treesFacade.getTreesList();
	});

	useEffect(() => {
		const hasNavigationTree = !isNil(value.navigationTree) && value.navigationTree !== '';
		const hasId = !isNil(value.id) && value.id !== '';

		if (hasNavigationTree) {
			treesFacade.getTree(value.navigationTree);
		}

		if (hasId && hasNavigationTree) {
			treeItemsFacade.fetchTreeItem(value.navigationTree, value.id);
		}
	}, [value.id, value.navigationTree]);

	/**
	 * Functions
	 */

	const onFormChange = (values: FormikValues): void => {
		onChange(values);
	};

	const handlePositionOnChange = (
		value: string[],
		setFieldValue: FormikProps<FormikValues>['setFieldValue']
	): void => {
		setFieldValue('position', value);
	};

	const getPositionInputValue = (options: CascaderOption[], inputValue: string[]): string => {
		return arrayTreeFilter(options, (o, level) => o.value === inputValue[level])
			.map(o => o.label)
			.join(' > ');
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
						<FormikOnChangeHandler
							delay={300}
							onChange={values => onFormChange(values)}
						/>
						<div className="u-margin-top">
							<h6 className="u-margin-bottom">Navigatie</h6>
							<div className="row">
								<div className="col-xs-12 col-sm-6">
									<Field
										as={Select}
										id="navigationTree"
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
												value={values.position}
												options={treeOptions}
												onChange={(value: string[]) =>
													handlePositionOnChange(value, setFieldValue)
												}
											>
												<div className="a-input__wrapper">
													<input
														onChange={() => null}
														placeholder="Kies een positie in de boom"
														value={getPositionInputValue(
															treeOptions,
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
										/>
										<small className="u-block u-text-light u-margin-top-xs">
											Geef dit item een korte beschrijving.
										</small>
									</div>
								</div>
							)}
						</div>
					</>
				);
			}}
		</Formik>
	);

	return <DataLoader loadingState={loadingTreesOptions} render={renderForm} />;
};

export default ContentDetailCompartment;
