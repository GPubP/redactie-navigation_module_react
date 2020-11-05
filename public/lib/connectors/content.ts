import { ContentAPI } from '@redactie/content-module';
import { ModuleValue } from '@redactie/content-module/dist/lib/services/content';
import { ExternalCompartmentOptions } from '@redactie/content-module/dist/lib/store/api/externalCompartments';
import Core from '@redactie/redactie-core';

const contentModuleAPI: ContentAPI = Core.modules.getModuleAPI('content-module') as ContentAPI;

export const registerContentDetailCompartment = <M = ModuleValue>(
	key: string,
	options: ExternalCompartmentOptions
): any | false =>
	contentModuleAPI ? contentModuleAPI.registerContentDetailCompartment<M>(key, options) : false;
