import { BaseMultiEntityQuery } from '@redactie/utils';

import { NavItem } from '../../navigation.types';

import { SiteStructureItemsState } from './siteStructureItems.model';
import { siteStructureItemsStore } from './siteStructureItems.store';

export class SiteStructureItemsQuery extends BaseMultiEntityQuery<SiteStructureItemsState> {
	public pendingSiteStructureItemSync = (): NavItem | undefined =>
		this.getValue()?.pendingSiteStructureItem;
}

export const siteStructureItemsQuery = new SiteStructureItemsQuery(siteStructureItemsStore);
