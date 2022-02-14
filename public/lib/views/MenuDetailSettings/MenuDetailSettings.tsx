import { Button, Textarea, TextField, RadioGroup } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { AlertContainer, useDetectValueChanges } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useMenu, useMenuDraft } from '../../hooks';
import { MenuMatchProps, MenuDetailRouteProps } from '../../menu.types';
import { ALERT_CONTAINER_IDS, MENU_DETAIL_TAB_MAP } from '../../navigation.const';
import { MenuSchema } from '../../services/menus';
import { menusFacade } from '../../store/menus';
import { LANG_OPTIONS, MENU_SETTINGS_VALIDATION_SCHEMA } from './MenuDetailSettings.const';

const MenuSettings: FC<MenuDetailRouteProps<MenuMatchProps>> = ({
	loading,
	isCreating,
	onSubmit,
}) => {
	const [menu] = useMenuDraft();
	const { menu: values } = useMenu();
	const [t] = useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(!loading, menu);

	const initialValues: MenuSchema | undefined = {
		...values,
		meta: {
			...values?.meta,
			lang: values?.meta?.lang || LANG_OPTIONS[0].value,
		},
	};

	/**
	 * Methods
	 */
	const onSave = (newMenuValue: MenuSchema): void => {
		onSubmit(
			{ ...(menu || {}), meta: { ...menu?.meta, ...newMenuValue.meta } },
			MENU_DETAIL_TAB_MAP.settings
		);
		resetIsChanged();
	};

	const onChange = (newMenuValue: MenuSchema): void => {
		menusFacade.setMenuDraft(newMenuValue);
	};

	const readonly = isCreating ? false : true; //TODO: replace 'true' with '!rights.canUpdate';

	/**
	 * Render
	 */

	if (!menu || !initialValues) {
		return null;
	}

	return (
		<Container>
			<div className="u-margin-bottom">
				<AlertContainer containerId={ALERT_CONTAINER_IDS.settings} />
			</div>
			<Formik
				initialValues={initialValues}
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
										name="meta.label"
										required
										state={errors.meta?.label && 'error'}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="meta.label"
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
										name="meta.description"
										required
										state={errors.meta?.description && 'error'}
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="meta.description"
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
										name="meta.lang"
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
											{menu?.uuid
												? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
												: t(CORE_TRANSLATIONS.BUTTON_BACK)}
										</Button>
										<Button
											iconLeft={loading ? 'circle-o-notch fa-spin' : null}
											disabled={loading || !isChanged}
											onClick={submitForm}
											type="success"
										>
											{menu?.uuid
												? t(CORE_TRANSLATIONS['BUTTON_SAVE'])
												: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
										</Button>
									</div>
								</ActionBarContentSection>
							</ActionBar>
						</>
					);
				}}
			</Formik>
		</Container>
	);
};

export default MenuSettings;
