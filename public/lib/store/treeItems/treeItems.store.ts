import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { TreeItemModel, TreeItemsState } from './treeItems.model';

@StoreConfig({ name: 'treeItems', idKey: 'id' })
export class TreeItemsStore extends BaseEntityStore<TreeItemsState, TreeItemModel> {}

export const treeItemsStore = new TreeItemsStore({
	createdTreeItems: [],
	currentPosition: [],
});
