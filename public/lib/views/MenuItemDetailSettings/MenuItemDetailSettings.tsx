import { Button, Checkbox, Textarea, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Cascader,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { ContentModel } from '@redactie/content-module';
import { InputFieldProps } from '@redactie/form-renderer-module';
import {
	AlertContainer,
	ErrorMessage,
	FormikOnChangeHandler,
	LeavePrompt,
	LoadingState,
	useDetectValueChanges,
} from '@redactie/utils';
import { Field, FieldProps, Formik, FormikProps, FormikValues } from 'formik';
import { omit } from 'ramda';
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NAV_STATUSES } from '../../components';
import formRendererConnector from '../../connectors/formRenderer';
import sitesConnector from '../../connectors/sites';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { getPositionInputValue } from '../../helpers/getPositionInputValue';
import { getTreeConfig } from '../../helpers/getTreeConfig';
import { useMenu, useMenuItem, useMenuItemDraft } from '../../hooks';
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
}) => {
	const { siteId, menuId } = useParams<{ menuId?: string; siteId: string }>();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [menuItemDraft] = useMenuItemDraft();
	const { menuItem, upsertingState } = useMenuItem();
	const { menu } = useMenu();
	const [t] = useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(
		!loading && !!menuItemDraft,
		menuItemDraft
	);
	const [contentItemPublished, setContentItemPublished] = useState(false);
	const isLoading = useMemo(() => upsertingState === LoadingState.Loading, [upsertingState]);

	useEffect(() => {
		if (!menuId || !siteId) {
			return;
		}

		menusFacade.getMenu(siteId, menuId);
	}, [menuId, siteId]);

	const canEdit = useMemo(() => {
		return menuItem?.id ? rights?.canUpdate : true;
	}, [menuItem, rights]);

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
		const parentId = formValue.position[formValue.position.length - 1];

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

	/**
	 * Render
	 */

	if (!ContentSelect) {
		return null;
	}

	return (
		<Container>
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
															setFieldValue(
																'externalUrl',
																`${site?.data.url}${value.meta.urlPath?.nl.value}`
															);
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
									<ErrorMessage name="slug" />
									<small className="u-block u-margin-top-xs">
										Zoek en selecteer een content item
									</small>
								</div>
							</div>
							<div className="row u-margin-top">
								<div className="col-xs-12">
									<div className="a-input has-icon-right is-required">
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
													disabled={!canEdit}
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
										<ErrorMessage name="description" />
										<small className="u-block u-margin-top-xs">
											Selecteer op welke plek in de boom je dit item wilt
											hangen.
										</small>
									</div>
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
											as={Checkbox}
											checked={
												values.publishStatus === NAV_STATUSES.PUBLISHED
											}
											id="publishStatus"
											disabled={!canEdit || !contentItemPublished}
											name="publishStatus"
											label="Je kan de status bewerken indien het content item online is"
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
											<Field
												as={Checkbox}
												checked={
													values.publishStatus === NAV_STATUSES.READY
												}
												id="readyStatus"
												disabled={!canEdit}
												name="publishStatus"
												label="Zet het menu-item aan wanneer het content item online is"
												onChange={(e: ChangeEvent<HTMLInputElement>) => {
													setFieldValue(
														'publishStatus',
														e.target.checked
															? NAV_STATUSES.READY
															: NAV_STATUSES.DRAFT
													);
												}}
											/>
										)}
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
											iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
											disabled={isLoading || !isChanged}
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
		</Container>
	);
};

export default MenuItemDetailSettings;
