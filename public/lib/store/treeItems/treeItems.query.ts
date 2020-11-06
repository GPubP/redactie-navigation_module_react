import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';

import { TreeItemModel, TreeItemsState } from './treeItems.model';
import { treeItemsStore } from './treeItems.store';

export class TreeItemsQuery extends BaseEntityQuery<TreeItemsState> {
	public selectTreeItem(itemId: string): Observable<TreeItemModel> {
		return this.selectEntity(itemId);
	}

	public getTreeItem(itemId: string): TreeItemModel {
		return this.getEntity(itemId);
	}

	public isTreeCreated(itemId: string): boolean {
		const value = this.getValue();
		return value.createdTreeItems.includes(itemId);
	}

	public getPosition(itemId: string): string[] {
		const value = this.getValue();
		return value.positions[itemId];
	}

	public getSlugIsChanged(): boolean {
		const value = this.getValue();
		return value.slugIsChanged;
	}
}

export const treeItemsQuery = new TreeItemsQuery(treeItemsStore);
