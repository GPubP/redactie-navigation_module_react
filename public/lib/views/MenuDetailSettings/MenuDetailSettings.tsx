import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	RadioGroup,
	Textarea,
	TextField,
} from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer, DeletePrompt, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { FC, ReactElement, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenu, useMenuDraft } from '../../hooks';
import { MenuDetailRouteProps, MenuMatchProps } from '../../menu.types';
import { ALERT_CONTAINER_IDS, MENU_DETAIL_TAB_MAP } from '../../navigation.const';
import { Menu } from '../../services/menus';
import { menusFacade } from '../../store/menus';

import {
	LANG_OPTIONS,
	MENU_SETTINGS_VALIDATION_SCHEMA,
	SETTINGS_ALLOWED_LEAVE_PATHS,
} from './MenuDetailSettings.const';

const MenuSettings: FC<MenuDetailRouteProps<MenuMatchProps>> = ({
	loading,
	isCreating,
	isRemoving,
	rights,
	onSubmit,
	onDelete,
}) => {
	const [menu] = useMenuDraft();
	const { menu: values, occurrences } = useMenu();
	const [t] = useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(!loading, menu);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

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

	const readonly = isCreating ? false : !rights.canUpdate;

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

	const renderDelete = (): ReactElement => {
		return (
			<>
				<Card className="u-margin-top">
					<CardBody>
						<CardTitle>Verwijderen</CardTitle>
						<CardDescription>
							{occurrences && occurrences.length > 0 ? (
								<span>
									Dit menu heeft{' '}
									<b>{occurrences ? occurrences.length : 0} menu items</b>.
									Verwijder deze items als je het menu wil verwijderen.
								</span>
							) : (
								<span>
									Er zijn <b>{occurrences ? occurrences.length : 0} menu items</b>
									. Je kan het menu verwijderen.
								</span>
							)}
						</CardDescription>
						<Button
							onClick={() => setShowDeleteModal(true)}
							className="u-margin-top"
							type="danger"
							iconLeft="trash-o"
							disabled={occurrences && occurrences.length > 0}
						>
							{t(CORE_TRANSLATIONS['BUTTON_REMOVE'])}
						</Button>
					</CardBody>
				</Card>
				<DeletePrompt
					body="Ben je zeker dat je deze view wil verwijderen? Dit kan niet ongedaan gemaakt worden."
					isDeleting={isRemoving}
					show={showDeleteModal}
					onCancel={onDeletePromptCancel}
					onConfirm={onDeletePromptConfirm}
				/>
			</>
		);
	};

	return (
		<Container>
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
										disabled={readonly}
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
										disabled={readonly}
										className="a-input--small"
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
										options={LANG_OPTIONS}
										state={errors.lang && 'error'}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="lang"
									/>
								</div>
							</div>
							<ActionBar className="o-action-bar--fixed" isOpen={!readonly}>
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
			{!isCreating && renderDelete()}
		</Container>
	);
};

export default MenuSettings;
