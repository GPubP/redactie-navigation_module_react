import { Button, Textarea, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
} from '@acpaas-ui/react-editorial-components';
import { useDetectValueChanges } from '@redactie/utils';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { FC } from 'react';

import { useCoreTranslation } from '../../connectors/translations';
import { MenuRouteProps } from '../../menu.types';
import { MENU_SETTINGS_VALIDATION_SCHEMA } from './MenuDetailSettings.const';

const MenuSettings: FC<MenuRouteProps> = () => {
	const [t] = useCoreTranslation();
	const [isChanged, resetIsChanged] = useDetectValueChanges(false, {});

	/**
	 * Methods
	 */
	const onSave = (newMenuValue: any): void => {
		console.log(newMenuValue);
		resetIsChanged();
	};

	const onChange = (newMenuValue: any): void => {
		console.log(newMenuValue);
	};

	/**
	 * Render
	 */
	return (
		<Container>
			<Formik
				initialValues={{}}
				onSubmit={console.log}
				validationSchema={MENU_SETTINGS_VALIDATION_SCHEMA}
			>
				{({ submitForm, values, resetForm }) => {
					onChange(values);

					return (
						<>
							<div className="row top-xs u-margin-bottom">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										label="Label"
										name="meta.label"
										required
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="meta.label"
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef deze view een gebruiksvriendelijke naam, bijvoorbeeld
										&lsquo;Titel&lsquo;
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-xs-12">
									<Field
										as={Textarea}
										className="a-input--small"
										label="Beschrijving"
										name="meta.description"
										required
									/>
									<ErrorMessage
										className="u-text-danger"
										component="p"
										name="meta.description"
									/>
									<div className="u-text-light u-margin-top-xs">
										Geef een beschrijving voor deze view.
									</div>
								</div>
							</div>
							<ActionBar className="o-action-bar--fixed">
								<ActionBarContentSection>
									<div className="u-wrapper row end-xs">
										<Button
											className="u-margin-right-xs"
											onClick={resetForm}
											negative
										>
											Cancel
										</Button>
										<Button onClick={submitForm} type="success">
											Save
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
