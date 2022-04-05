export interface ContentTypeTenantDetailTabFormState {
	url: {
		urlPattern: {
			multiLanguage: boolean;
			[lang: string]: string | boolean;
		};
	};
}

export interface ContentTypeTenantDetailFormProps {
	value: any;
	isLoading: boolean;
	hasChanges: boolean;
	setFormValue: (values: any) => void;
	onFormSubmit: () => void;
	onCancel: () => void;
}
