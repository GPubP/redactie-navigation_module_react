import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { SiteStructureModel, SiteStructuresState } from './siteStructures.model';

@StoreConfig({ name: 'siteStructures', idKey: 'id' })
export class SiteStructuresStore extends BaseEntityStore<SiteStructuresState, SiteStructureModel> {}

export const siteStructuresStore = new SiteStructuresStore();
