import { SelectOption } from '@redactie/utils';
import { FormikValues } from 'formik';

export interface NewMenuItemFormState {
	menu: string;
}

export interface NewMenuItemFormProps {
	className: string;
	onSubmit: (values: FormikValues) => void;
	formState: NewMenuItemFormState;
	options: SelectOption[];
}
