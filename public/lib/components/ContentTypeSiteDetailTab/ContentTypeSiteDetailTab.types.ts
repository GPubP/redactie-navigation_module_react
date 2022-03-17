export interface ContentTypeSiteDetailTabFormState {
	url: {
		urlPattern: {
			multilanguage: boolean;
			[lang: string]: string | boolean;
		};
	};
}
