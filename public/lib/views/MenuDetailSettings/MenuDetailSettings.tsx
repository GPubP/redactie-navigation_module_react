import { Button, Textarea, TextField, RadioGroup } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenu, useMenuDraft } from '../../hooks';
import { MenuMatchProps, MenuDetailRouteProps } from '../../menu.types';
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
	rights,
	onSubmit,
}) => {
	const [menu] = useMenuDraft();
	const { menu: values } = useMenu();
	const [t] = useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(!loading, menu);

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

	/**
	 * Render
	 */

	if (!menu || !values) {
		return null;
	}

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
		</Container>
	);
};

export default MenuSettings;
