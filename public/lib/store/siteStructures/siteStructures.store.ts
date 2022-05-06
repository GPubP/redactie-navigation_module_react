import { StoreConfig } from '@datorama/akita';
import { BaseMultiEntityStore } from '@redactie/utils';

import { SiteStructuresState } from './siteStructures.model';

@StoreConfig({ name: 'siteStructures', idKey: 'id' })
export class SiteStructuresStore extends BaseMultiEntityStore<SiteStructuresState> {}

export const siteStructuresStore = new SiteStructuresStore({});
