import { FormikValues } from 'formik';

export interface ContentTypeTenantDetailTabFormState {
	url: {
		urlPattern: {
			multilanguage: boolean;
			[lang: string]: string | boolean;
		};
	};
}

export interface ContentTypeTenantDetailFormProps {
	value: any;
	formValue: FormikValues;
	isLoading: boolean;
	hasChanges: boolean;
	setFormValue: (values: any) => void;
	onFormSubmit: () => void;
	onCancel: () => void;
	onValidateCompartments: (invalidCompartments: string[]) => void;
}
