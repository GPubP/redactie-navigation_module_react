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
		label: 'published',
		value: NAV_ITEM_STATUSES.PUBLISHED,
	},
];
