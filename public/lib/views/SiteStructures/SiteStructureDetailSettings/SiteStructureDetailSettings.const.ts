import { object, string } from 'yup';

export const SITE_STRUCTURE_SETTINGS_VALIDATION_SCHEMA = object().shape({
	label: string().required('Label is een verplicht veld'),
	description: string().required('Beschrijving is een verplicht veld'),
	lang: string().required('Taal is een verplicht veld'),
});
