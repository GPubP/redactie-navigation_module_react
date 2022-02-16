import { object, ObjectSchema, string } from 'yup';

import { PUBLISH_STATUS_OPTIONS } from '../../../navigation.const';

import { FilterFormState } from './FilterForm.types';

export const FILTER_FORM_VALIDATION_SCHEMA: ObjectSchema<FilterFormState> = object().shape({
	label: string(),
});

export const FILTER_PUBLISH_STATUS_OPTIONS = [
	{
		label: 'Alle',
		value: '',
	},
	...PUBLISH_STATUS_OPTIONS,
];
