import { Next } from '@redactie/react-router-guards';
import { take } from 'rxjs/operators';
import sitesConnector from '../connectors/sites';

export async function canShowSiteStructure(siteId: string, next: any): Promise<Next> {
	const hasSite = sitesConnector.sitesFacade.hasSite(siteId);
	if (!hasSite) {
		sitesConnector.sitesFacade.getSite({ id: siteId });
	}
	const site = await sitesConnector.sitesFacade
		.selectSite(siteId)
		.pipe(take(1))
		.toPromise();
	if (site.data.modulesConfig.find((x: any) => x.name === 'navigation').config.allowSiteStructure)
		return next();
	else {
		throw new Error();
	}
}
