import { object, string } from 'yup';

export const NAV_ITEM_SETTINGS_VALIDATION_SCHEMA = object().shape({
	label: string().required('Label is een verplicht veld'),
	slug: string().required('Slug is een verplicht veld'),
});
