import { Language } from '@redactie/utils';

export interface ContentTypeSiteDetailTabFormState {
	url: {
		urlPattern: {
			multilanguage: boolean;
			[lang: string]: string | boolean;
		};
	};
}

export interface ContentTypeSiteDetailFormProps {
	value: any;
	isLoading: boolean;
	hasChanges: boolean;
	setFormValue: (values: any) => void;
	onFormSubmit: () => void;
	onCancel: () => void;
}
