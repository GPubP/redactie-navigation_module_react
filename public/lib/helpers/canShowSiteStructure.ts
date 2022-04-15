import { isNil } from '@datorama/akita';
import { GuardFunction, Next } from '@redactie/redactie-core';
import { ModuleSettings } from '@redactie/sites-module';
import { generatePath } from 'react-router-dom';
import { filter, take } from 'rxjs/operators';

import sitesConnector from '../connectors/sites';
import { MODULE_PATHS } from '../navigation.const';

const getAllowSiteStructure = async (siteId: string): Promise<boolean> => {
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

export const guardSiteStructure: GuardFunction = async (to, from, next) => {
	try {
		const siteId = to.match.params.siteId;
		const allowSiteStructure = await getAllowSiteStructure(siteId);

		if (allowSiteStructure) {
			return next();
		}

		const tenantId = from?.match.params.tenantId || to.meta.tenantId;
		const fromPathname = from?.location?.pathname;
		const hasRedirectURI = fromPathname !== to?.location?.pathname;

		next.redirect({
			pathname: generatePath(`/${tenantId}${MODULE_PATHS.forbidden403}`),
			search: hasRedirectURI ? `?redirect=${fromPathname}` : '',
		});
	} catch {
		throw new Error('Sitestructure not allowed');
	}
};

export const canShowSiteStructure = async (
	{ siteId }: Record<string, any>,
	next: Next
): Promise<void> => {
	try {
		const allowSiteStructure = await getAllowSiteStructure(siteId);

		if (allowSiteStructure) {
			next();
		} else {
			throw new Error('Sitestructure not allowed');
		}
	} catch (e) {
		throw new Error(e as any);
	}
};
