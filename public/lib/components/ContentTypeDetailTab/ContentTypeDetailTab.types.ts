export interface ContentTypeDetailTabProps {
	contentType?: any;
	value?: any;
	isValid?: boolean;

	onChange: (e: any) => boolean;
	updateContentType?: (e: any) => boolean;
	setValidity?: (isValid: boolean) => void;
}
