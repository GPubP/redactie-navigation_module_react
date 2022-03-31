import Core, { ModuleRouteConfig } from '@redactie/redactie-core';
import { ExternalTabOptions, SitesModuleAPI } from '@redactie/sites-module';

class SitesConnector {
	public static apiName = 'sites-module';
	public api: SitesModuleAPI;

	// reset
	public get sitesFacade(): SitesModuleAPI['store']['sites']['facade'] {
		return this.api.store.sites.facade;
	}

	public get sitesService(): SitesModuleAPI['store']['sites']['service'] {
		return this.api.store.sites.service;
	}

	public get hooks(): SitesModuleAPI['hooks'] {
		return this.api.hooks;
	}

	public get config(): SitesModuleAPI['config'] {
		return this.api.config;
	}

	public registerSiteStructureTab(key: string, options: ExternalTabOptions): void | false {
		return this.api ? this.api.registerSiteUpdateTab(key, options) : false;
	}

	constructor(api?: SitesModuleAPI) {
		if (!api) {
			throw new Error(
				`Content Module:
				Dependencies not found: ${SitesConnector.apiName}`
			);
		}
		this.api = api;
	}

	public registerRoutes(routes: ModuleRouteConfig): void | false {
		return this.api ? this.api.routes.register(routes) : false;
	}
}

const sitesConnector = new SitesConnector(
	Core.modules.getModuleAPI<SitesModuleAPI>(SitesConnector.apiName)
);

export default sitesConnector;
