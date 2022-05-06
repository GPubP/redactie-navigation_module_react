import { StoreConfig } from '@datorama/akita';
import { BaseMultiEntityStore } from '@redactie/utils';

import { SiteStructureItemsState } from './siteStructureItems.model';

@StoreConfig({ name: 'siteStructureItems', idKey: 'id' })
export class SiteStructureItemsStore extends BaseMultiEntityStore<SiteStructureItemsState> {}

export const siteStructureItemsStore = new SiteStructureItemsStore();
