import { handleMultilanguageFormErrors, LanguageErrors } from '@redactie/utils';
import { FormikErrors, FormikValues } from 'formik';

export const getCompartmentErrors = (
	currentFormErrors: FormikErrors<FormikValues>,
	formValue: FormikValues,
	activeCompartment: string
): LanguageErrors =>
	handleMultilanguageFormErrors(currentFormErrors, formValue, (errors: LanguageErrors) => {
		return Object.keys(errors).reduce((acc, lang) => {
			return {
				...acc,
				[lang]: errors[lang].filter(error => error.startsWith(`${activeCompartment}.`)),
			};
		}, {});
	});
