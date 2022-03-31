import { ContentAPI, ExternalCompartmentOptions } from '@redactie/content-module';
import Core from '@redactie/redactie-core';

class ContentConnector {
	public api: ContentAPI;

	public readonly apiName: string = 'content-module';

	constructor() {
		this.api = Core.modules.getModuleAPI<ContentAPI>(this.apiName);
	}

	public registerContentDetailCompartment(
		name: string,
		options: ExternalCompartmentOptions
	): void | false {
		return this.api ? this.api.registerContentDetailCompartment(name, options) : false;
	}

	public getContentItem = (siteId: string, contentItemId: string): void | false =>
		this.api ? this.api.store.content.facade.getContentItem(siteId, contentItemId) : false;

	public get contentService(): ContentAPI['store']['content']['service'] {
		return this.api.store.content.service;
	}
}

const contentConnector = new ContentConnector();

export default contentConnector;
