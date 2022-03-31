import { LanguagesModuleAPI } from '@redactie/language-module';
import Core from '@redactie/redactie-core';
import { first } from 'rxjs/operators';

class LanguagesConnector {
	public static apiName = 'languages-module';

	public initialized$ = Core.modules
		.selectModuleAPI<LanguagesModuleAPI>(LanguagesConnector.apiName)
		.pipe(first());

	public getApi(): LanguagesModuleAPI {
		return Core.modules.getModuleAPI<LanguagesModuleAPI>(LanguagesConnector.apiName);
	}

	public get languagesFacade(): LanguagesModuleAPI['store']['languages']['facade'] {
		return this.getApi().store.languages.facade;
	}

	public get hooks(): LanguagesModuleAPI['hooks'] {
		return this.getApi().hooks;
	}
}

const languagesConnector = new LanguagesConnector();

export default languagesConnector;
