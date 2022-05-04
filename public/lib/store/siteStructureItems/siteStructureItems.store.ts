import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { NavItem } from '../../navigation.types';

import { SiteStructureItemModel, SiteStructureItemsState } from './siteStructureItems.model';

@StoreConfig({ name: 'siteStructureItems', idKey: 'id' })
export class SiteStructureItemsStore extends BaseEntityStore<
	SiteStructureItemsState,
	SiteStructureItemModel
> {}

export const siteStructureItemsStore = new SiteStructureItemsStore({
	pendingSiteStructureItem: {} as NavItem,
});
