export interface ContentTypeTenantDetailTabFormState {
	url: {
		urlPattern: {
			multilanguage: boolean;
			[lang: string]: string | boolean;
		};
	};
}
