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
	menu: {
		allowMenus: boolean;
		allowedMenus: {
			multiLanguage: boolean;
			[lang: string]: number[] | boolean;
		};
	};
	siteStructure: {
		position: {
			multiLanguage: boolean;
			[lang: string]: string | boolean;
		},
		structurePosition?: string;
	}
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
