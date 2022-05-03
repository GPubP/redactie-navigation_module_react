import { ContentTypeDetailModel } from '@redactie/content-types-module';
import { Language } from '@redactie/utils';
import { FormikValues } from 'formik';

export interface ContentTypeSiteDetailTabFormState {
	url: {
		urlPattern: {
			multiLanguage: boolean;
			[lang: string]: string | boolean;
		};
	};
}

export interface ContentTypeSiteDetailFormProps {
	value: any;
	formValue: FormikValues;
	isLoading: boolean;
	hasChanges: boolean;
	setFormValue: (values: any) => void;
	onFormSubmit: () => void;
	onCancel: () => void;
	onValidateCompartments: (invalidCompartments: string[]) => void;
	siteId: string;
	contentType: ContentTypeDetailModel;
	activeLanguage: Language;
}
