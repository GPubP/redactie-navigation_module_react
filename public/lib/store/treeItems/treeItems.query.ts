import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';

import { TreeItemModel, TreeItemsState } from './treeItems.model';
import { treeItemsStore } from './treeItems.store';

export class TreeItemsQuery extends BaseEntityQuery<TreeItemsState> {
	public selectTreeItem(treeId: string): Observable<TreeItemModel> {
		return this.selectEntity(treeId);
	}

	public getTreeItem(treeId: string): TreeItemModel {
		return this.getEntity(treeId);
	}
}

export const treeItemsQuery = new TreeItemsQuery(treeItemsStore);
