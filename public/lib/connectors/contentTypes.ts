import Core from '@redactie/redactie-core';

const contentTypeModuleAPI = Core.modules.getModuleAPI('content-type-module');

export const registerCTDetailTab = (key: string, options: any): any | false =>
	contentTypeModuleAPI ? contentTypeModuleAPI.registerCTDetailTab(key, options) : false;
