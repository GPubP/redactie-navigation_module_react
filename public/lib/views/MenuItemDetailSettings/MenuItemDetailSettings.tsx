import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	Checkbox,
	Switch,
	Textarea,
	TextField,
} from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Cascader,
} from '@acpaas-ui/react-editorial-components';
import { ContentModel } from '@redactie/content-module';
import { InputFieldProps } from '@redactie/form-renderer-module';
import {
	AlertContainer,
	DeletePrompt,
	ErrorMessage,
	FormikOnChangeHandler,
	LeavePrompt,
	useDetectValueChanges,
} from '@redactie/utils';
import { Field, FieldProps, Formik, FormikProps, FormikValues } from 'formik';
import { omit } from 'ramda';
import React, { ChangeEvent, FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NAV_STATUSES } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import sitesConnector from '../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { getPositionInputValue } from '../../helpers/getPositionInputValue';
import { getTreeConfig } from '../../helpers/getTreeConfig';
import { MenuItemDetailRouteProps } from '../../menu.types';
import { ALERT_CONTAINER_IDS } from '../../navigation.const';
import { CascaderOption } from '../../navigation.types';
import { MenuItem } from '../../services/menuItems';
import { Menu } from '../../services/menus';
import { menuItemsFacade } from '../../store/menuItems';
import { menusFacade } from '../../store/menus';

import {
	MENU_ITEM_SETTINGS_VALIDATION_SCHEMA,
	SETTINGS_ALLOWED_LEAVE_PATHS,
} from './MenuItemDetailSettings.const';
import { getInitialFormValues } from './MenuItemDetailSettings.helpers';
import { MenuItemDetailForm } from './MenuItemDetailSettings.types';

const MenuItemDetailSettings: FC<MenuItemDetailRouteProps> = ({
	rights,
	onSubmit,
	onDelete,
	loading,
	removing,
	menu,
	menuItem,
	menuItemDraft,
}) => {
	const { siteId, menuId } = useParams<{ menuId?: string; siteId: string }>();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [t] = useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(
		!loading && !!menuItemDraft,
		menuItemDraft
	);
	const [contentItemPublished, setContentItemPublished] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		if (!menuId || !siteId) {
			return;
		}

		menusFacade.getMenu(siteId, menuId);
	}, [menuId, siteId]);

	const canEdit = useMemo(() => {
		return menuItem?.id ? rights?.canUpdate : true;
	}, [menuItem, rights]);

	const canDelete = useMemo(() => {
		return menuItem?.id ? rights?.canDelete : false;
	}, [menuItem, rights]);

	const isUpdate = useMemo(() => {
		return !!menuItem?.id;
	}, [menuItem]);

	const treeConfig = useMemo<{
		options: CascaderOption[];
		activeItem: MenuItem | undefined;
	}>(() => getTreeConfig<Menu, MenuItem>(menu, menuItem?.id as number), [menu, menuItem]);

	const initialValues: MenuItemDetailForm = useMemo(() => {
		if (!menuItem) {
			return {} as MenuItemDetailForm;
		}

		return getInitialFormValues(menuItem, treeConfig.options);
	}, [menuItem, treeConfig.options]);

	const ContentSelect: React.FC<InputFieldProps> | null | undefined = useMemo(() => {
		const fieldRegistry = formRendererConnector.api.fieldRegistry;

		if (!fieldRegistry) {
			return null;
		}

		return fieldRegistry.get('content', 'contentReference')?.component;
	}, []);

	/**
	 * Methods
	 */
	const onSave = (): void => {
		onSubmit(omit(['weight'], menuItemDraft) as MenuItem);
		resetIsChanged();
	};

	const onChange = (formValue: FormikValues): void => {
		const parentId = formValue.position
			? formValue.position[formValue.position.length - 1]
			: undefined;

		menuItemsFacade.setMenuItemDraft({
			...menuItemDraft,
			...omit(['position'], formValue),
			...(parentId && { parentId }),
		} as MenuItem);
	};

	const handlePositionOnChange = (
		value: number[],
		setFieldValue: FormikProps<FormikValues>['setFieldValue']
	): void => {
		setFieldValue('position', value);
	};

	const onDeletePromptConfirm = async (): Promise<void> => {
		if (!menuItem) {
			return;
		}

		resetIsChanged();

		await onDelete(menuItem);
		setShowDeleteModal(false);
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	/**
	 * Render
	 */

	if (!ContentSelect) {
		return null;
	}

	const renderDelete = (): ReactElement => {
		return (
			<>
				<Card className="u-margin-top">
					<CardBody>
						<CardTitle>Verwijderen</CardTitle>
						<CardDescription>
							Opgelet: Reeds bestaande verwijzingen naar dit menu-item worden
							ongeldig.
						</CardDescription>
						<Button
							onClick={() => setShowDeleteModal(true)}
							className="u-margin-top"
							type="danger"
							iconLeft="trash-o"
						>
							{t(CORE_TRANSLATIONS['BUTTON_REMOVE'])}
						</Button>
					</CardBody>
				</Card>
				<DeletePrompt
					body="Ben je zeker dat je dit menu-item wil verwijderen? Dit kan niet ongedaan gemaakt worden."
					isDeleting={removing}
					show={showDeleteModal}
					onCancel={onDeletePromptCancel}
					onConfirm={onDeletePromptConfirm}
				/>
			</>
		);
	};

	return (
		<>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.settings} />
			</div>
			<Formik
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSave}
				validationSchema={MENU_ITEM_SETTINGS_VALIDATION_SCHEMA}
			>
				{({ values, errors, submitForm, resetForm, getFieldHelpers, setFieldValue }) => {
					return (
						<>
							<FormikOnChangeHandler
								onChange={(values: FormikValues) => onChange(values)}
							/>
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
									<small className="u-block u-margin-top-xs">
										Bepaal het label voor dit menu-item. Dit is het woord dat de
										eindgebruiker ziet in het menu.
									</small>
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
															setContentItemPublished(
																!!value.meta.published
															);
															setFieldValue(
																'slug',
																value.meta.slug.nl
															);

															if (value.meta.urlPath?.nl.value) {
																setFieldValue(
																	'externalUrl',
																	`${site?.data.url}${value.meta.urlPath?.nl.value}`
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
												value={menuItem?.parentId}
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
																onClick={(
																	e: React.SyntheticEvent
																) => {
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
										{isUpdate && (
											<Button
												className="u-margin-left-xs"
												disabled={!canEdit}
												onClick={() => {
													console.log(menuItemDraft?.parentId);
												}}
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
										className="a-input--small"
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
											as={Switch}
											checked={
												values.publishStatus === NAV_STATUSES.PUBLISHED
											}
											labelFalse="Uit"
											labelTrue="Aan"
											id="publishStatus"
											disabled={!canEdit || !contentItemPublished}
											name="publishStatus"
											label=""
											onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
														values.publishStatus === NAV_STATUSES.READY
													}
													id="readyStatus"
													disabled={!canEdit}
													name="publishStatus"
													label="Zet het menu-item aan wanneer het content item online is"
													onChange={(
														e: ChangeEvent<HTMLInputElement>
													) => {
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
										<small className="u-block">
											Je kan de status bewerken indien het content item online
											is
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
											{menuItem?.id
												? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
												: t(CORE_TRANSLATIONS.BUTTON_BACK)}
										</Button>
										<Button
											iconLeft={loading ? 'circle-o-notch fa-spin' : null}
											disabled={loading || !isChanged}
											onClick={submitForm}
											type="success"
										>
											{menuItem?.id
												? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
												: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
										</Button>
									</div>
								</ActionBarContentSection>
							</ActionBar>
							<LeavePrompt
								allowedPaths={SETTINGS_ALLOWED_LEAVE_PATHS}
								when={isChanged}
								shouldBlockNavigationOnConfirm
								onConfirm={submitForm}
							/>
						</>
					);
				}}
			</Formik>
			{isUpdate && canDelete && renderDelete()}
		</>
	);
};

export default MenuItemDetailSettings;
