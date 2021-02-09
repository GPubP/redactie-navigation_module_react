import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';

import { TreeItemModel, TreeItemsState } from './treeItems.model';
import { treeItemsStore } from './treeItems.store';

export class TreeItemsQuery extends BaseEntityQuery<TreeItemsState> {
	public selectTreeItem(itemId: number): Observable<TreeItemModel> {
		return this.selectEntity(itemId);
	}

	public getTreeItem(itemId: number): TreeItemModel {
		return this.getEntity(itemId);
	}

	public isTreeCreated(itemId: number): boolean {
		const value = this.getValue();
		return value.createdTreeItems.includes(itemId);
	}

	public getPosition(itemId: number): number[] {
		const value = this.getValue();
		return value.positions[itemId];
	}

	public getSlugIsChanged(): boolean {
		const value = this.getValue();
		return value.slugIsChanged;
	}
}

export const treeItemsQuery = new TreeItemsQuery(treeItemsStore);
