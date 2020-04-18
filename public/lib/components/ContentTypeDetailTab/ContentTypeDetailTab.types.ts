export interface ContentTypeDetailTabProps {
	contentType?: any;
	value?: any;

	onSubmit: (e: any) => boolean;
	onCancel: () => void;
	updateContentType?: (e: any) => boolean;
}
