import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { TreeModel, TreesState } from './trees.model';

@StoreConfig({ name: 'trees', idKey: 'id' })
export class TreesStore extends BaseEntityStore<TreesState, TreeModel> {}

export const treesStore = new TreesStore();
