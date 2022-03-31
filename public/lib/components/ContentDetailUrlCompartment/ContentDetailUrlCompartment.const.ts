import { object, string } from 'yup';

export const VALIDATION_SCHEMA = object().shape({
	navigationTree: string(),
	position: string(),
});
