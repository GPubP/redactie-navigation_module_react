import { Next } from '@redactie/redactie-core';

import { getAllowMenus } from '../../helpers';

const canShowMenus = async ({ siteId }: Record<string, any>, next: Next): Promise<void> => {
	try {
		const allowMenus = await getAllowMenus(siteId);

		if (allowMenus) {
			next();
		} else {
			throw new Error('Menus not allowed');
		}
	} catch (e) {
		throw new Error(e as any);
	}
};

export default canShowMenus;
