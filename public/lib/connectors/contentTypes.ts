import { ContentTypeAPI, ExternalTabOptions } from '@redactie/content-types-module';
import Core from '@redactie/redactie-core';

class ContentTypeConnector {
	public apiName = 'content-type-module';
	public api: ContentTypeAPI;

	constructor() {
		this.api = Core.modules.getModuleAPI<ContentTypeAPI>(this.apiName);
	}

	public get metadataFacade(): ContentTypeAPI['store']['metadata']['facade'] {
		return this.api.store.metadata.facade;
	}

	public registerCTDetailTab(key: string, options: ExternalTabOptions): void | false {
		return this.api.registerCTDetailTab(key, options);
	}

	public get contentTypeService(): ContentTypeAPI['store']['contentTypes']['service'] {
		return this.api.store.contentTypes.service;
	}
}

const contentTypeConnector = new ContentTypeConnector();

export default contentTypeConnector;
