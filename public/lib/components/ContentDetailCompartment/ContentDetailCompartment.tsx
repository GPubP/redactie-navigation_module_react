import { Select, Spinner, Textarea, TextField } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import { CompartmentProps } from '@redactie/content-module';
import { DataLoader, FormikOnChangeHandler, LoadingState, usePrevious } from '@redactie/utils';
import arrayTreeFilter from 'array-tree-filter';
import { Field, Formik, FormikProps, FormikValues } from 'formik';
import React, { FC, ReactElement, useEffect, useMemo } from 'react';

import { useTree, useTreesOptions } from '../../hooks';
import { CascaderOption } from '../../navigation.types';
import { TreeDetailItemResponse } from '../../services/trees';
import { treesFacade } from '../../store/trees';

import { STATUS_OPTIONS, VALIDATION_SCHEMA } from './ContentDetailCompartment.const';

const ContentDetailCompartment: FC<CompartmentProps> = ({ value = {}, contentValue, onChange }) => {
	/**
	 * Hooks
	 */
	const [loadingTrees, treesOptions] = useTreesOptions();
	const [loadingTree, tree] = useTree();
	const initialValues = useMemo(
		() => ({
			id: value.id || '',
			navigationTree: value.navigationTree || '',
			position: value.position || [],
			label: value.label || '',
			slug: contentValue?.meta.slug.nl,
			description: value.description || '',
			status: value.status || STATUS_OPTIONS[0].value,
		}),
		[
			contentValue,
			value.description,
			value.id,
			value.label,
			value.navigationTree,
			value.position,
			value.status,
		]
	);
	const previousValue = usePrevious(value);
	const treeOptions = useMemo<CascaderOption[]>(() => {
		if (tree) {
			const mapTreeItemsToOptions = (items: TreeDetailItemResponse[]): CascaderOption[] => {
				return items
					.map((item: TreeDetailItemResponse) => {
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

	useEffect(() => {
		if (value.navigationTree && value.navigationTree !== previousValue?.navigationTree) {
			treesFacade.getTree(value.navigationTree);
		}
	}, [value, previousValue]);

	/**
	 * Functions
	 */

	const onFormChange = (values: FormikValues, submitForm: () => Promise<void>): void => {
		submitForm();
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
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onChange}
			validationSchema={VALIDATION_SCHEMA}
		>
			{({ errors, submitForm, touched, values, setFieldValue }) => {
				const navigationTreeSelected =
					values.navigationTree !== null &&
					values.navigationTree !== undefined &&
					values.navigationTree !== '';

				return (
					<>
						<FormikOnChangeHandler
							delay={300}
							onChange={values => onFormChange(values, submitForm)}
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
										</div>
										<div className="col-xs-12 col-sm-6">
											<Field
												as={TextField}
												description="Geef een 'slug' op voor dit item."
												id="slug"
												name="slug"
												disabled
												label="Slug"
												state={
													!!touched.slug && !!errors.slug ? 'error' : ''
												}
												required
											/>
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
									<div className="u-margin-top row">
										<div className="col-xs-12 col-sm-6">
											<Field
												as={Select}
												id="status"
												name="status"
												label="Status"
												required
												options={STATUS_OPTIONS}
											/>
											<small className="u-block u-text-light u-margin-top-xs">
												Selecteer een status
											</small>
										</div>
									</div>
								</div>
							)}
						</div>
					</>
				);
			}}
		</Formik>
	);

	return <DataLoader loadingState={loadingTrees} render={renderForm} />;
};

export default ContentDetailCompartment;
