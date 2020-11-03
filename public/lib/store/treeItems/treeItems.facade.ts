import { BaseEntityFacade } from '@redactie/utils';
import { Observable } from 'rxjs';

import {
	CreateTreeItemPayload,
	TreeItem,
	treesApiService,
	TreesApiService,
	UpdateTreeItemPayload,
} from '../../services/trees';

import { TreeItemModel } from './treeItems.model';
import { TreeItemsQuery, treeItemsQuery } from './treeItems.query';
import { TreeItemsStore, treeItemsStore } from './treeItems.store';

export class TreeItemsFacade extends BaseEntityFacade<
	TreeItemsStore,
	TreesApiService,
	TreeItemsQuery
> {
	public selectTreeItem(treeItemId: string): Observable<TreeItemModel> {
		return this.query.selectTreeItem(treeItemId);
	}

	public getTreeItem(treeItemId: string): TreeItemModel {
		return this.query.getTreeItem(treeItemId);
	}

	public fetchTreeItem(treeId: string, treeItemId: string): void {
		if (this.query.hasEntity(treeItemId)) {
			return;
		}

		this.store.setIsFetchingOne(true);

		this.service
			.getTreeItem(treeId, treeItemId)
			.then(response => {
				if (response) {
					this.store.upsert(treeItemId, response);
					this.store.setIsFetchingOne(false);
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}

	public createTreeItem(treeId: string, body: CreateTreeItemPayload): Promise<TreeItem> {
		this.store.setIsCreating(true);

		return this.service
			.createTreeItem(treeId, body)
			.then(response => {
				if (response) {
					this.store.add(response);
					this.store.setIsCreating(false);
				}
				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isCreating: false,
				});
				throw error;
			});
	}

	public updateTreeItem(
		treeId: string,
		itemId: string,
		body: UpdateTreeItemPayload
	): Promise<TreeItem> {
		this.store.setIsUpdating(true);

		return this.service
			.updateTreeItem(treeId, itemId, body)
			.then(response => {
				if (response) {
					this.store.update(itemId, response);
					this.store.setIsUpdating(false);
				}
				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
				});
				throw error;
			});
	}
}

export const treeItemsFacade = new TreeItemsFacade(treeItemsStore, treesApiService, treeItemsQuery);
