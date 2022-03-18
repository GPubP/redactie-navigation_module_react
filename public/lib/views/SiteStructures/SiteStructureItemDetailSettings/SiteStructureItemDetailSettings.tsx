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
	LoadingState,
	useDetectValueChanges,
} from '@redactie/utils';
import { Field, FieldProps, Formik, FormikProps, FormikValues } from 'formik';
import { equals, omit } from 'ramda';
import React, { ChangeEvent, FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NAV_STATUSES } from '../../../components';
import { RearrangeModal } from '../../../components/RearrangeModal';
import formRendererConnector from '../../../connectors/formRenderer';
import sitesConnector from '../../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { getInitialNavItemsFormValues } from '../../../helpers';
import { extractSiblings } from '../../../helpers/extractSiblings';
import { getPositionInputValue } from '../../../helpers/getPositionInputValue';
import { getTreeConfig } from '../../../helpers/getTreeConfig';
import { useSiteStructureItems } from '../../../hooks';
import { MODULE_TRANSLATIONS } from '../../../i18next/translations.const';
import { ALERT_CONTAINER_IDS } from '../../../navigation.const';
import {
	CascaderOption,
	NavItemDetailForm,
	RearrangeNavItem,
	SiteStructureItemDetailRouteProps,
} from '../../../navigation.types';
import { SiteStructureItem } from '../../../services/siteStructureItems';
import { SiteStructure } from '../../../services/siteStructures';
import { siteStructureItemsFacade } from '../../../store/siteStructureItems';
import { siteStructuresFacade } from '../../../store/siteStructures';

import { SITE_STRUCTURE_ITEM_SETTINGS_VALIDATION_SCHEMA } from './SiteStructureItemDetailSettings.const';

const SiteStructureItemDetailSettings: FC<SiteStructureItemDetailRouteProps> = ({
	rights,
	onSubmit,
	onDelete,
	loading,
	removing,
	siteStructure,
	siteStructureItem,
	siteStructureItemDraft,
}) => {
	const { siteId, siteStructureId } = useParams<{ siteStructureId?: string; siteId: string }>();
	const [site] = sitesConnector.hooks.useSite(siteId);
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(
		!loading && !!siteStructureItemDraft,
		siteStructureItemDraft
	);
	const [contentItemPublished, setContentItemPublished] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showRearrange, setShowRearrange] = useState(false);
	const [sortRows, setSortRows] = useState<SiteStructureItem[]>([]);
	const [parentChanged, setParentChanged] = useState<boolean>(false);
	const {
		siteStructureItems,
		upsertingState: siteStructureItemsUpsertingState,
	} = useSiteStructureItems();

	const canEdit = useMemo(() => {
		return siteStructureItem?.id ? rights?.canUpdate : true;
	}, [rights, siteStructureItem]);

	const canDelete = useMemo(() => {
		return siteStructureItem?.id ? rights?.canDelete : false;
	}, [rights, siteStructureItem]);

	const isUpdate = useMemo(() => {
		return !!siteStructureItem?.id;
	}, [siteStructureItem]);

	useEffect(() => {
		if (!siteStructureId || !siteId) {
			return;
		}

		siteStructuresFacade.getSiteStructure(siteId, siteStructureId);
	}, [siteStructureId, siteId]);

	useEffect(() => {
		setParentChanged(siteStructureItem?.parentId !== siteStructureItemDraft?.parentId);

		if (!siteStructureId || !siteId || !isUpdate) {
			return;
		}

		siteStructureItemsFacade.getSubset(
			siteId,
			siteStructureId,
			siteStructureItemDraft?.parentId,
			1
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isUpdate, siteStructureId, siteStructureItemDraft, siteId]);

	const treeConfig = useMemo<{
		options: CascaderOption[];
		activeItem: SiteStructureItem | undefined;
	}>(
		() =>
			getTreeConfig<SiteStructure, SiteStructureItem>(
				siteStructure,
				siteStructureItem?.id as number
			),
		[siteStructure, siteStructureItem]
	);

	const initialValues: NavItemDetailForm = useMemo(() => {
		if (!siteStructureItem) {
			return {} as NavItemDetailForm;
		}

		setContentItemPublished(siteStructureItem.publishStatus === NAV_STATUSES.PUBLISHED);
		return getInitialNavItemsFormValues(siteStructureItem, treeConfig.options);
	}, [siteStructureItem, treeConfig.options]);

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
		onSubmit(omit(['weight'], siteStructureItemDraft) as SiteStructureItem);
		resetIsChanged();
	};

	const onChange = (formValue: FormikValues): void => {
		const parentId = formValue.position
			? formValue.position[formValue.position.length - 1]
			: undefined;

		if (
			!equals(
				{
					...omit(['parentId'], siteStructureItemDraft),
					...omit(['position', 'parentId'], formValue),
					...(parentId && { parentId }),
				} as SiteStructureItem,
				siteStructureItemDraft
			)
		) {
			siteStructureItemsFacade.setSiteStructureItemDraft({
				...omit(['parentId'], siteStructureItemDraft),
				...omit(['position', 'parentId'], formValue),
				...(parentId && { parentId }),
			} as SiteStructureItem);
		}
	};

	const handlePositionOnChange = (
		value: number[],
		setFieldValue: FormikProps<FormikValues>['setFieldValue']
	): void => {
		setFieldValue('position', value);
	};

	const onDeletePromptConfirm = async (): Promise<void> => {
		if (!siteStructureItem) {
			return;
		}

		resetIsChanged();

		await onDelete(siteStructureItem);
		setShowDeleteModal(false);
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	const onRearrange = async (items: RearrangeNavItem[]): Promise<void> => {
		await siteStructureItemsFacade.rearrangeItems(
			siteId,
			siteStructureId as string,
			items,
			ALERT_CONTAINER_IDS.settings
		);
		setShowRearrange(false);
	};

	const openRearrangeModal = (): void => {
		setShowRearrange(true);
		setSortRows(
			extractSiblings(
				siteStructureItem?.id as number,
				siteStructureItems as SiteStructureItem[]
			)
		);
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
							Opgelet: Reeds bestaande verwijzingen naar dit sitestructuur-item worden
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
					body="Ben je zeker dat je dit sitestructuur-item wil verwijderen? Dit kan niet ongedaan gemaakt worden."
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
				validationSchema={SITE_STRUCTURE_ITEM_SETTINGS_VALIDATION_SCHEMA}
			>
				{({ values, errors, submitForm, resetForm, getFieldHelpers, setFieldValue }) => {
					return (
						<>
							<FormikOnChangeHandler
								onChange={(values: FormikValues) => onChange(values)}
							/>
							<p className="u-margin-bottom">
								{tModule(
									MODULE_TRANSLATIONS.SITE_STRUCTURE_CONTENT_REF_DESCRIPTION
								)}
							</p>
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
										Bepaal het label voor dit sitestructuur-item. Dit is het
										woord dat de eindgebruiker ziet in de sitestructuur.
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
															setFieldValue(
																'slug',
																value?.meta.slug?.nl
															);
															setFieldValue(
																'publishStatus',
																NAV_STATUSES.DRAFT
															);
															setContentItemPublished(
																!!value?.meta.published
															);

															if (value?.meta.urlPath?.nl?.value) {
																setFieldValue(
																	'externalUrl',
																	`${site?.data.url}${value.meta.urlPath?.nl.value}`
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
												value={siteStructureItem?.parentId}
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
											checked={
												values?.publishStatus === NAV_STATUSES.PUBLISHED
											}
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
													label="Zet het sitestructuur-item aan wanneer het content item online is"
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
										<small className="u-block u-margin-top-xs">
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
											{siteStructureItem?.id
												? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
												: t(CORE_TRANSLATIONS.BUTTON_BACK)}
										</Button>
										<Button
											iconLeft={loading ? 'circle-o-notch fa-spin' : null}
											disabled={loading || !isChanged}
											onClick={submitForm}
											type="success"
										>
											{siteStructureItem?.id
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
								loading={siteStructureItemsUpsertingState === LoadingState.Loading}
								onCancel={() => setShowRearrange(false)}
								onConfirm={onRearrange}
							/>
						</>
					);
				}}
			</Formik>
			{isUpdate && canDelete && renderDelete()}
		</>
	);
};

export default SiteStructureItemDetailSettings;
