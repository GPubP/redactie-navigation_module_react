import { isNil } from 'ramda';

export const isNotEmpty = (value: any): boolean => {
	return !isNil(value) && value !== '';
};

export const isEmpty = (value: any): boolean => {
	return isNil(value) || value === '';
};
