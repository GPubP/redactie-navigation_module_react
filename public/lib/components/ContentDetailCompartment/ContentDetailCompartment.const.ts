import { object, string } from 'yup';

export const VALIDATION_SCHEMA = object().shape({
	navigationTree: string().required(),
	position: string().required(),
	label: string().required(),
	slug: string().required(),
	description: string(),
	status: string().required(),
});

export const NAVIGATION_TREE_OPTIONS = [
	{
		label: 'Hoofdnavigatie',
		value: 'hoofdnavigatie',
	},
];

export const POSITION_OPTIONS = [
	{
		label: 'Cultuur en sport > Sport >',
		value: 'sport',
	},
];

export const STATUS_OPTIONS = [
	{
		label: 'Gepubliceerd',
		value: 'gepubliceerd',
	},
];
