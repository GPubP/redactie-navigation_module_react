import { object, string } from 'yup';

export const MENU_SETTINGS_VALIDATION_SCHEMA = object().shape({
	meta: object().shape({
		label: string().required('Label is een verplicht veld'),
		description: string().required('Beschrijving is een verplicht veld'),
	}),
});

export const LANG_OPTIONS = [
	{ key: 'nl', label: 'Nederlands (NL)', value: 'nl' },
];
