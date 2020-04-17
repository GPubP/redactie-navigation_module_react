import Core from '@redactie/redactie-core';

const contentModuleAPI = Core.modules.getModuleAPI('content-module');

export const registerContentDetailCompartment = (key: string, options: any): any | false =>
	contentModuleAPI
		? contentModuleAPI.registerContentDetailCompartment('navigation', options)
		: false;
