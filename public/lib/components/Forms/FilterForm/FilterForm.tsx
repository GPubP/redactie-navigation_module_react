import { TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { Field, Form, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors/translations';

import { FILTER_FORM_VALIDATION_SCHEMA } from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	activeFilters,
	initialState,
	clearActiveFilter,
	onCancel,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */

	const [t] = useCoreTranslation();

	/**
	 * Render
	 */

	return (
		<Formik
			initialValues={initialState}
			onSubmit={onSubmit}
			validationSchema={FILTER_FORM_VALIDATION_SCHEMA}
			enableReinitialize
		>
			{({ resetForm, submitForm }) => {
				return (
					<Form>
						<Filter
							title={t(CORE_TRANSLATIONS.FILTER_TITLE)}
							noFilterText="Geen filters beschikbaar"
							onConfirm={submitForm}
							onClean={() => {
								resetForm();
								onCancel();
							}}
							confirmText={t(CORE_TRANSLATIONS.FILTER_APPLY)}
							cleanText={t(CORE_TRANSLATIONS.FILTER_CLEAR)}
							activeFilters={activeFilters}
							onFilterRemove={clearActiveFilter}
						>
							<FilterBody>
								<div className="col-xs-12 col-md-6 u-margin-bottom">
									<Field
										as={TextField}
										label="Zoeken"
										name="label"
										iconright="search"
										placeholder="Zoek op woord"
									/>
								</div>
							</FilterBody>
						</Filter>
					</Form>
				);
			}}
		</Formik>
	);
};

export default FilterForm;
