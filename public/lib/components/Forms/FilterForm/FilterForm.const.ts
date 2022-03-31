import { object, string } from 'yup';

export const FILTER_FORM_VALIDATION_SCHEMA: any = object().shape({
	label: string(),
});

export const FILTER_PUBLISH_STATUS_OPTIONS = [
	{
		label: 'Alle',
		value: '',
	},
];
