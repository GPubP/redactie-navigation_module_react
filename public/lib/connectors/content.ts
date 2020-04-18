import { ContentAPI } from '@redactie/content-module';
import { ExternalCompartmentOptions } from '@redactie/content-module/dist/lib/store/api/externalCompartments';
import Core from '@redactie/redactie-core';

const contentModuleAPI: ContentAPI = Core.modules.getModuleAPI('content-module') as ContentAPI;

export const registerContentDetailCompartment = (
	key: string,
	options: ExternalCompartmentOptions
): any | false =>
	contentModuleAPI
		? contentModuleAPI.registerContentDetailCompartment('navigation', options)
		: false;
