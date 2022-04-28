import { GuardFunction } from '@redactie/redactie-core';
import { generatePath } from 'react-router-dom';

import { getAllowMenus } from '../../helpers';
import { MODULE_PATHS } from '../../navigation.const';

const menuGuard: GuardFunction = async (to, from, next): Promise<void> => {
	try {
		const siteId = to.match.params.siteId;
		const allowSiteStructure = await getAllowMenus(siteId);

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
		throw new Error('Menus not allowed');
	}
};

export default menuGuard;
