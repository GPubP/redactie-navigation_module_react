import { isNil } from '@datorama/akita';
import { ModuleSettings } from '@redactie/sites-module';
import { filter, take } from 'rxjs/operators';

import sitesConnector from '../connectors/sites';

export const getAllowSiteStructure = async (siteId: string): Promise<boolean> => {
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

	return (
		(site?.data?.modulesConfig || []).find(
			(siteNavigationConfig: ModuleSettings) => siteNavigationConfig?.name === 'navigation'
		)?.config?.allowSiteStructure ?? false
	);
};
