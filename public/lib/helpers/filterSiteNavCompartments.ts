import { ModuleSettings } from '@redactie/sites-module';

import { NavSiteCompartments } from '../components/ContentTypeSiteDetailTab/ContentTypeSiteDetailTab.const';

export const filterSiteNavCompartments = (
	compartment: { label: string; to: NavSiteCompartments },
	navSettings: ModuleSettings | undefined
): boolean => {
	if (
		(compartment.to === NavSiteCompartments.menu && !navSettings?.config.allowMenus) ||
		(compartment.to === NavSiteCompartments.siteStructure &&
			!navSettings?.config.allowSiteStructure)
	) {
		return false;
	}

	return true;
};
