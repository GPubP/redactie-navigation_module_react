import { LanguagesModuleAPI } from '@redactie/language-module';
import Core from '@redactie/redactie-core';

class LanguagesConnector {
	public api: LanguagesModuleAPI;

	public get hooks(): LanguagesModuleAPI['hooks'] {
		return this.api.hooks;
	}

	constructor() {
		this.api = Core.modules.getModuleAPI<LanguagesModuleAPI>('languages-module');
	}
}

const languagesConnector = new LanguagesConnector();

export default languagesConnector;
