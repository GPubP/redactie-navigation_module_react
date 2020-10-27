import { Select, Textarea, TextField } from '@acpaas-ui/react-components';
import { CompartmentProps } from '@redactie/content-module';
import { FormikOnChangeHandler } from '@redactie/utils';
import { Field, Formik, FormikValues } from 'formik';
import React, { FC, useMemo } from 'react';

import {
	NAVIGATION_TREE_OPTIONS,
	POSITION_OPTIONS,
	STATUS_OPTIONS,
	VALIDATION_SCHEMA,
} from './ContentDetailCompartment.const';

const ContentDetailCompartment: FC<CompartmentProps> = ({ value = {}, onChange }) => {
	const initialValues = useMemo(
		() => ({
			navigationTree: value.navigationTree || NAVIGATION_TREE_OPTIONS[0].value,
			position: value.position || POSITION_OPTIONS[0].value,
			label: value.label || '',
			slug: value.slug || '',
			description: value.description || '',
			status: value.status || STATUS_OPTIONS[0].value,
		}),
		[value]
	);

	const onFormChange = (values: FormikValues, submitForm: () => Promise<void>): void => {
		submitForm();
		onChange(values);
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onChange}
			validationSchema={VALIDATION_SCHEMA}
		>
			{({ errors, submitForm, touched }) => (
				<>
					<FormikOnChangeHandler onChange={values => onFormChange(values, submitForm)} />
					<div className="u-margin-top">
						<h6 className="u-margin-bottom">Navigatie</h6>
						<div className="row">
							<div className="col-xs-12 col-sm-6">
								<Field
									as={Select}
									id="navigationTree"
									name="navigationTree"
									label="Navigatieboom"
									required
									options={NAVIGATION_TREE_OPTIONS}
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Selecteer een navigatieboom
								</small>
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									as={Select}
									id="position"
									name="position"
									label="Positie"
									required
									options={POSITION_OPTIONS}
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Selecteer op welke plek je de pagina in de navigatieboom wilt
									hangen.
								</small>
							</div>
						</div>
						<div className="row u-margin-top">
							<div className="col-xs-12 col-sm-6">
								<Field
									as={TextField}
									description="Geef een naam of 'label' op voor dit item."
									id="label"
									name="label"
									label="Label"
									state={!!touched.label && !!errors.label ? 'error' : ''}
									required
								/>
							</div>
							<div className="col-xs-12 col-sm-6">
								<Field
									as={TextField}
									description="Geef een 'slug' op voor dit item."
									id="slug"
									name="slug"
									label="Slug"
									state={!!touched.slug && !!errors.slug ? 'error' : ''}
									required
								/>
							</div>
						</div>
						<div className="u-margin-top">
							<Field
								as={Textarea}
								id="description"
								name="description"
								label="Beschrijving"
								placeholder="Typ een beschrijving"
							/>
							<small className="u-block u-text-light u-margin-top-xs">
								Geef dit item een korte beschrijving.
							</small>
						</div>
						<div className="u-margin-top row">
							<div className="col-xs-12 col-sm-6">
								<Field
									as={Select}
									id="status"
									name="status"
									label="Status"
									required
									options={STATUS_OPTIONS}
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Selecteer een status
								</small>
							</div>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

export default ContentDetailCompartment;
