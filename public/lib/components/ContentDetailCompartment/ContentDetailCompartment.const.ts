import { number, object, string } from 'yup';

const isNotEmpty = (value: any): boolean => value !== null && value !== undefined && value !== '';

export const VALIDATION_SCHEMA = object().shape({
	navigationTree: string(),
	position: string(),
	description: string(),
	label: string().when('navigationTree', {
		is: isNotEmpty,
		then: string().required('Label is een verplicht veld.'),
	}),
	status: string().when('navigationTree', {
		is: isNotEmpty,
		then: string().required('Status is een verplicht veld.'),
	}),
});

export const MINIMAL_VALIDATION_SCHEMA = object().shape({
	id: number(),
	navigationTree: string(),
});

export const NAV_ITEM_STATUSES = {
	REJECTED: 'rejected',
	ARCHIVED: 'archived',
	DRAFT: 'draft',
	INREVIEW: 'inreview',
	READY: 'ready',
	PUBLISHED: 'published',
};

export const STATUS_OPTIONS = [
	{
		label: 'Afgewezen',
		value: NAV_ITEM_STATUSES.REJECTED,
	},
	{
		label: 'Gearchiveerd',
		value: NAV_ITEM_STATUSES.ARCHIVED,
	},
	{
		label: 'Werkversie',
		value: NAV_ITEM_STATUSES.DRAFT,
	},
	{
		label: 'Klaar voor nakijken',
		value: NAV_ITEM_STATUSES.INREVIEW,
	},
	{
		label: 'Klaar voor publicatie',
		value: NAV_ITEM_STATUSES.READY,
	},
	{
		label: 'Gepubliceerd',
		value: NAV_ITEM_STATUSES.PUBLISHED,
	},
];
