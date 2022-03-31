import {
	Link as AUILink,
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	RadioGroup,
	Textarea,
	TextField,
} from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, DeletePrompt, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';

import languagesConnector from '../../../connectors/languages';
import sitesConnector from '../../../connectors/sites';
import translationsConnector, { CORE_TRANSLATIONS } from '../../../connectors/translations';
import { useMenu, useMenuDraft } from '../../../hooks';
import {
	ALERT_CONTAINER_IDS,
	LANG_OPTIONS,
	MENU_DETAIL_TAB_MAP,
	MODULE_PATHS,
} from '../../../navigation.const';
import { MenuDetailRouteProps, NavigationMatchProps } from '../../../navigation.types';
import { Menu } from '../../../services/menus';
import { menusFacade } from '../../../store/menus';

import {
	MENU_SETTINGS_VALIDATION_SCHEMA,
	SETTINGS_ALLOWED_LEAVE_PATHS,
} from './MenuDetailSettings.const';

const MenuSettings: FC<MenuDetailRouteProps<NavigationMatchProps>> = ({
	match,
	loading,
	isCreating,
	isRemoving,
	rights,
	onSubmit,
	onDelete,
}) => {
	const { siteId } = match.params;
	const [menu] = useMenuDraft();
	const { menu: values, occurrences } = useMenu();
	const [t] = translationsConnector.useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(!loading, menu);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [, , , languages] = languagesConnector.hooks.useLanguages();
	const [site] = sitesConnector.hooks.useSite(siteId);

	const canEdit = isCreating ? true : rights.canUpdate;
	const canDelete = isCreating ? false : rights.canDelete;

	const languageOptions = useMemo(() => {
		if (!site || !languages) {
			return [];
		}

		return [
			...LANG_OPTIONS,
			...(site.data.languages as string[]).map((lang: string) => {
				const currentLang = languages?.find(language => language.uuid === lang);

				return {
					key: currentLang?.key,
					label: `${currentLang?.localizedName} (${currentLang?.key})`,
					value: currentLang?.key,
				};
			}),
		].map(lang => ({ ...lang, disabled: !canEdit }));
	}, [canEdit, languages, site]);

	useEffect(() => {
		languagesConnector.languagesFacade.getLanguages({
			active: true,
			includeContentOccurrences: false,
			site: siteId,
			sort: 'name',
		});
	}, [siteId]);

	/**
	 * Methods
	 */
	const onSave = (newMenuValue: Menu): void => {
		onSubmit({ ...(menu || {}), ...newMenuValue }, MENU_DETAIL_TAB_MAP.settings);
		resetIsChanged();
	};

	const onChange = (newMenuValue: Menu): void => {
		menusFacade.setMenuDraft(newMenuValue);
	};

	const onDeletePromptConfirm = async (): Promise<void> => {
		if (!values) {
			return;
		}

		resetIsChanged();

		await onDelete(values);
		setShowDeleteModal(false);
	};

	const onDeletePromptCancel = (): void => {
		setShowDeleteModal(false);
	};

	/**
	 * Render
	 */

	if (!menu || !values) {
		return null;
	}

	const renderOccurrences = (): ReactElement => {
		const pluralSingularText =
			occurrences && occurrences.length === 1 ? 'content type' : 'content types';
		return (
			<>
				<p>
					Dit menu wordt gebruikt op{' '}
					<strong>
						{occurrences?.length || 0} {pluralSingularText}
					</strong>
					.
				</p>
				{occurrences && occurrences.length > 0 && (
					<ul>
						{occurrences.map((occurrence: any, index: number) => (
							<li key={`${index}_${occurrence.uuid}`}>
								<AUILink
									to={generatePath(`${MODULE_PATHS.site.contentTypeMenu}`, {
										siteId,
										contentTypeId: occurrence.uuid,
									})}
									component={Link}
								>
									{occurrence.meta.label}
								</AUILink>
							</li>
						))}
					</ul>
				)}
			</>
		);
	};

	const renderMenuItems = (): ReactElement => {
		const pluralSingularItems =
			values.itemCount && values.itemCount === 1 ? 'menu-item' : 'menu-items';

		return (
			<p>
				Dit menu heeft{' '}
				<strong>
					{values.itemCount ? values.itemCount : 0} {pluralSingularItems}
				</strong>
				.
			</p>
		);
	};

	const renderDelete = (): ReactElement => {
		return (
			<>
				<Card className="u-margin-top">
					<CardBody>
						<CardTitle>Verwijderen</CardTitle>
						<CardDescription>
							{renderOccurrences()}
							{renderMenuItems()}
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
					body="Ben je zeker dat je dit menu wil verwijderen? Dit kan niet ongedaan gemaakt worden."
					isDeleting={isRemoving}
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
				initialValues={values}
				onSubmit={onSave}
				validationSchema={MENU_SETTINGS_VALIDATION_SCHEMA}
			>
				{({ errors, submitForm, values, resetForm }) => {
					onChange(values);

					return (
						<>
							<div className="row top-xs u-margin-bottom">
								<div className="col-xs-12">
									<Field
										as={TextField}
										disabled={!canEdit}
										label="Naam"
										name="label"
										required
										state={errors.label && 'error'}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="label"
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef het menu een duidelijke naam.
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-xs-12">
									<Field
										as={Textarea}
										disabled={!canEdit}
										label="Beschrijving"
										name="description"
										required
										state={errors.description && 'error'}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="description"
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef het menu een duidelijke beschrijving.
									</div>
								</div>
							</div>
							<div className="row u-margin-top">
								<div className="col-xs-12">
									<Field
										as={RadioGroup}
										id="lang"
										label="Taal"
										name="lang"
										required
										options={languageOptions}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="lang"
									/>
								</div>
							</div>
							<ActionBar className="o-action-bar--fixed" isOpen={canEdit}>
								<ActionBarContentSection>
									<div className="u-wrapper row end-xs">
										<Button
											className="u-margin-right-xs"
											onClick={resetForm}
											negative
										>
											{menu?.id
												? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
												: t(CORE_TRANSLATIONS.BUTTON_BACK)}
										</Button>
										<Button
											iconLeft={loading ? 'circle-o-notch fa-spin' : null}
											disabled={loading || !isChanged}
											onClick={submitForm}
											type="success"
										>
											{menu?.id
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
			{!isCreating && canDelete && renderDelete()}
		</>
	);
};

export default MenuSettings;
