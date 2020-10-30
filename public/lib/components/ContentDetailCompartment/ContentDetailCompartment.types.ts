export interface ContentDetailCompartmentProps {
	contentType?: any; // get type from content type module
	contentVaue?: any; // get type from content module
	// content type value
	settings?: any; // Module settings => get type from content module
	// content detail value
	value?: any; // the value of the navigation module
	validationschema: any;
	isValid?: boolean;

	onChange: (e: any) => boolean; // Boolean for validation result (maybe?)
	updateContent?: (e: any) => boolean; // For edge cases where content item must be changed. Boolean for validation result (maybe?)
	setValidity?: (isValid: boolean) => void;
}

export interface ContentDetailCompartmentFormState {
	id?: string;
	navigationTree: string;
	position: string[];
	label: string;
	slug: string;
	description: string;
	status: string;
}
