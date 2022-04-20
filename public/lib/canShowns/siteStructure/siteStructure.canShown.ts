import { Next } from '@redactie/redactie-core';

import { getAllowSiteStructure } from '../../helpers';

const canShowSiteStructure = async ({ siteId }: Record<string, any>, next: Next): Promise<void> => {
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

export default canShowSiteStructure;
