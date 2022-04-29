import { Button, Select } from '@acpaas-ui/react-components';
import { ErrorMessage } from '@redactie/utils';
import classNames from 'classnames';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import translationsConnector, { CORE_TRANSLATIONS } from '../../connectors/translations';
import { MODULE_TRANSLATIONS } from '../../i18next/translations.const';

import { NEW_MENU_ITEM_FORM_VALIDATION_SCHEMA } from './NewMenuItemForm.const';
import { NewMenuItemFormProps } from './NewMenuItemForm.types';

const NewMenuItemForm: FC<NewMenuItemFormProps> = ({ onSubmit, formState, className, options }) => {
	const [t] = translationsConnector.useCoreTranslation();
	const [tModule] = translationsConnector.useModuleTranslation();

	return (
		<Formik
			initialValues={formState}
			validationSchema={NEW_MENU_ITEM_FORM_VALIDATION_SCHEMA}
			onSubmit={onSubmit}
		>
			{({ submitForm, values }) => (
				<div className={classNames(className, 'row')}>
					<div className="col-xs-12 col-md">
						<Field
							required
							as={Select}
							options={options}
							id="menu"
							label="Menu"
							name="menu"
							placeholder={tModule(MODULE_TRANSLATIONS.SELECT_MENU)}
						/>
						<small className="u-block u-text-light u-margin-top-xs">
							Zoek en selecteer een menu.
						</small>
						<ErrorMessage name="menu" />
					</div>
					<div className="u-flex-shrink-md col-xs-12 col-sm-4 u-margin-top">
						<Button
							htmlType="button"
							onClick={submitForm}
							outline
							disabled={!values.menu}
						>
							{t(CORE_TRANSLATIONS.BUTTON_ADD)}
						</Button>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default NewMenuItemForm;
