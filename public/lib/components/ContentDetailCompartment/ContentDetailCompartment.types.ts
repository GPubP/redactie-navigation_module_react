export interface ContentDetailCompartmentProps {
	contentType?: any; // get type from content type module
	contentVaue?: any; // get type from content module
	settings?: any; // Module settings => get type from content module
	value?: any; // the value of the navigation module
	isValid?: boolean;

	onChange?: (e: any) => boolean; // Boolean for validation result (maybe?)
	updateContent?: (e: any) => boolean; // For edge cases where content item must be changed. Boolean for validation result (maybe?)
	setValidity?: (isValid: boolean) => void;
}
