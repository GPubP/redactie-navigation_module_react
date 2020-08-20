import { FormikValues } from 'formik';

export interface FormikOnChangeHandlerProps {
	delay?: number;
	onChange: (values: FormikValues) => void;
	initialValues?: { [key: string]: any };
	values?: { [key: string]: any };
}
