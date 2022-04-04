import { isNil } from '@datorama/akita';
import { ModuleSettings } from '@redactie/sites-module';
import { filter, take } from 'rxjs/operators';

import sitesConnector from '../connectors/sites';

export const canShowSiteStructure = async (
	{ siteId }: Record<string, unknown>,
	next: Function
): Promise<void> => {
	try {
		const hasSite = sitesConnector.sitesFacade.hasSite(siteId as string);

		if (!hasSite) {
			sitesConnector.sitesFacade.getSite({ id: siteId as string });
		}

		const site = await sitesConnector.sitesFacade
			.selectSite(siteId as string)
			.pipe(
				filter(site => !isNil(site)),
				take(1)
			)
			.toPromise();

		if (
			(site?.data?.modulesConfig || []).find(
				(siteNavigationConfig: ModuleSettings) => siteNavigationConfig.name === 'navigation'
			)?.config?.allowSiteStructure
		) {
			next();
		} else {
			throw new Error('Sitestructure not allowed');
		}
	} catch (e) {
		throw new Error(e as any);
	}
};
