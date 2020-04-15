import { Select, Textarea, TextField } from '@acpaas-ui/react-components';
import { Field, Formik } from 'formik';
import React, { FC, useMemo } from 'react';

import AutoSubmit from '../AutoSubmit/AutoSubmit';

import { ContentDetailCompartmentProps } from './ContentDetailCompartment.types';

const ContentDetailCompartment: FC<ContentDetailCompartmentProps> = ({ value = {}, onChange }) => {
	const initialValues = useMemo(
		() => ({
			navigationTree: value.navigationTree || 'hoofdnavigatie',
			position: value.position || 'sport',
			label: value.label || '',
			slug: value.slug || '',
			description: value.description || '',
			status: value.status || 'gepubliceerd',
		}),
		[value]
	);

	const onFormSubmit = (values: any): void => {
		onChange(values);
	};

	const navigationTreeOptions = [
		{
			label: 'Hoofdnavigatie',
			value: 'hoofdnavigatie',
		},
	];

	const positionOptions = [
		{
			label: 'Cultuur en sport > Sport >',
			value: 'sport',
		},
	];

	const statusOptions = [
		{
			label: 'Gepubliceerd',
			value: 'gepubliceerd',
		},
	];

	return (
		<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
			{() => (
				<>
					<AutoSubmit />
					<div className="row u-margin-top">
						<div className="col-xs-12 col-sm-6">
							<Field
								as={Select}
								id="navigationTree"
								name="navigationTree"
								label="Navigatieboom"
								required={true}
								options={navigationTreeOptions}
							></Field>
							<div className="u-text-light u-margin-top-xs">
								Selecteer een navigatieboom
							</div>
						</div>
						<div className="col-xs-12 col-sm-6">
							<Field
								as={Select}
								id="position"
								name="position"
								label="Positie"
								required={true}
								options={positionOptions}
							></Field>
							<div className="u-text-light u-margin-top-xs">
								Selecteer op welke plek je de pagina in de navigatieboom wilt
								hangen.
							</div>
						</div>
					</div>
					<div className="row u-margin-top">
						<div className="col-xs-12 col-sm-6">
							<Field
								as={TextField}
								id="label"
								name="label"
								label="Label"
								required={true}
							></Field>
							<div className="u-text-light u-margin-top-xs">
								Geef een naam of &apos;label&apos; op voor dit item.
							</div>
						</div>
						<div className="col-xs-12 col-sm-6">
							<Field
								as={TextField}
								id="slug"
								name="slug"
								label="Slug"
								required={true}
							></Field>
							<div className="u-text-light u-margin-top-xs">
								Geef een &apos;slug&apos; op voor dit item.
							</div>
						</div>
					</div>
					<div className="u-margin-top">
						<Field
							as={Textarea}
							id="description"
							name="description"
							label="Beschrijving"
							placeholder="Typ een beschrijving"
						></Field>
						<div className="u-text-light u-margin-top-xs">
							Geef dit item een korte beschrijving.
						</div>
					</div>
					<div className="u-margin-top row">
						<div className="col-xs-12 col-sm-6">
							<Field
								as={Select}
								id="status"
								name="status"
								label="Status"
								required={true}
								options={statusOptions}
							></Field>
							<div className="u-text-light u-margin-top-xs">Selecteer een status</div>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

export default ContentDetailCompartment;
