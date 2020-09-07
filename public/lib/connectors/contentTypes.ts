import { ContentTypeAPI, ExternalTabOptions } from '@redactie/content-types-module';
import Core from '@redactie/redactie-core';

const contentTypeModuleAPI: ContentTypeAPI = Core.modules.getModuleAPI(
	'content-type-module'
) as ContentTypeAPI;

export const registerCTDetailTab = (key: string, options: ExternalTabOptions): void | false =>
	contentTypeModuleAPI ? contentTypeModuleAPI.registerCTDetailTab(key, options) : false;
