import { FormsAPI } from '@redactie/form-renderer-module';
import Core from '@redactie/redactie-core';

class FormRendererConnector {
	public apiName = 'forms-module';
	public api: FormsAPI;

	constructor() {
		this.api = Core.modules.getModuleAPI<FormsAPI>(this.apiName);
	}
}

const formRendererConnector = new FormRendererConnector();

export default formRendererConnector;
