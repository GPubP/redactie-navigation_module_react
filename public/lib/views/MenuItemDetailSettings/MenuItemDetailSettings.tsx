import { Button, Textarea, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer, LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenuItem, useMenuItemDraft } from '../../hooks';
import { MenuDetailRouteProps, MenuItemMatchProps } from '../../menu.types';
import { ALERT_CONTAINER_IDS, MENU_DETAIL_TAB_MAP } from '../../navigation.const';
import { MenuItem } from '../../services/menuItems';
import { menuItemsFacade } from '../../store/menuItems';

import {
	MENU_ITEM_SETTINGS_VALIDATION_SCHEMA,
	SETTINGS_ALLOWED_LEAVE_PATHS,
} from './MenuItemDetailSettings.const';
const MenuItemDetailSettings: FC<MenuDetailRouteProps<MenuItemMatchProps>> = ({
	loading,
	isCreating,
	rights,
	onSubmit,
}) => {
	const [menuItem] = useMenuItemDraft();
	const { menuItem: values } = useMenuItem();
	const [t] = useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(!loading, menuItem);

	/**
	 * Methods
	 */
	const onSave = (newMenuItemValue: MenuItem): void => {
		onSubmit({ ...(menuItem || {}), ...newMenuItemValue }, MENU_DETAIL_TAB_MAP.settings);
		resetIsChanged();
	};

	const onChange = (newMenuItemValue: MenuItem): void => {
		menuItemsFacade.setMenuItemDraft(newMenuItemValue);
	};

	const canEdit = isCreating ? true : rights.canUpdate;

	/**
	 * Render
	 */

	if (!menuItem || !values) {
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
				validationSchema={MENU_ITEM_SETTINGS_VALIDATION_SCHEMA}
			>
				{({ errors, submitForm, values, resetForm }) => {
					onChange(values);

					return (
						<>
							<div className="row top-xs u-margin-bottom">
								<div className="col-xs-12 col-md-6">
									<Field
										as={TextField}
										disabled={!canEdit}
										label="Label"
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
										Bepaal het label voor dit menu-item. Dit is het woord dat de
										eindgebruiker ziet in het menu.
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-xs-12">
									<Field
										as={Textarea}
										disabled={!canEdit}
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
										Geef dit item een korte beschrijving.
									</div>
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
		</Container>
	);
};

export default MenuItemDetailSettings;
