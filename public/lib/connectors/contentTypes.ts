import Core from '@redactie/redactie-core';

const contentTypeModuleAPI = Core.modules.getModuleAPI('content-type-module');

export const registerContentTypeModuleTab = (key: string, options: any): any | false =>
	contentTypeModuleAPI ? contentTypeModuleAPI.registerContentTypeModuleTab(key, options) : false;
