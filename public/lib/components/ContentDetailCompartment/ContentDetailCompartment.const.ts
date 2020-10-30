import { object, string } from 'yup';

const isNotEmpty = (value: any): boolean => value !== null && value !== undefined && value !== '';

export const VALIDATION_SCHEMA = object().shape({
	navigationTree: string(),
	position: string(),
	description: string(),
	label: string().when('navigationTree', {
		is: isNotEmpty,
		then: string().required(),
	}),
	slug: string().when('navigationTree', {
		is: isNotEmpty,
		then: string().required(),
	}),
	status: string().when('navigationTree', {
		is: isNotEmpty,
		then: string().required(),
	}),
});

export const STATUS_OPTIONS = [
	{
		label: 'Afgewezen',
		value: 'rejected',
	},
	{
		label: 'Gearchiveerd',
		value: 'archived',
	},
	{
		label: 'Werkversie',
		value: 'draftf',
	},
	{
		label: 'Klaar voor nakijken',
		value: 'inreview',
	},
	{
		label: 'Klaar voor publicatie',
		value: 'ready',
	},
	{
		label: 'published',
		value: 'Gepubliceerd',
	},
];
