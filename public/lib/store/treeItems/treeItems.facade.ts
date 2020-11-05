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
	public fetchTreeItem(treeId: string, treeItemId: string): Promise<TreeItem | void> {
		if (this.query.hasEntity(treeItemId)) {
			return Promise.resolve(this.getTreeItem(treeItemId));
		}

		this.store.setIsFetchingOne(true);

		return this.service
			.getTreeItem(treeId, treeItemId)
			.then(response => {
				if (response) {
					this.store.upsert(treeItemId, response);
					this.store.setIsFetchingOne(false);
				}
				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}

	public createTreeItem(treeId: string, body: CreateTreeItemPayload): Promise<TreeItem> {
		return this.service.createTreeItem(treeId, body).then(response => {
			if (response) {
				this.store.add(response);
				this.store.update(previousState => ({
					createdTreeItems: [...previousState.createdTreeItems, response.id],
				}));
			}
			return response;
		});
	}

	public updateTreeItem(
		treeId: string,
		itemId: string,
		body: UpdateTreeItemPayload
	): Promise<void> {
		return this.service.updateTreeItem(treeId, itemId, body).then(response => {
			if (response) {
				this.store.update(itemId, response);
				this.store.update(previousState => ({
					createdTreeItems: previousState.createdTreeItems.filter(
						treeItemId => treeItemId !== itemId
					),
				}));
			}
		});
	}

	public deleteTreeItem(treeId: string, itemId: string): Promise<void> {
		return this.service.deleteTreeItem(treeId, itemId).then(() => {
			return this.store.remove(itemId);
		});
	}

	public selectTreeItem(treeItemId: string): Observable<TreeItemModel> {
		return this.query.selectTreeItem(treeItemId);
	}

	public getTreeItem(treeItemId: string): TreeItemModel {
		return this.query.getTreeItem(treeItemId);
	}

	public localUpateTreeItem(itemId: string, body: UpdateTreeItemPayload): void {
		this.store.update(itemId, previousState => {
			return {
				...previousState,
				...body,
			};
		});
	}

	public removeFromCreatedTreeItems(itemId: string): void {
		this.store.update(previousState => ({
			createdTreeItems: previousState.createdTreeItems.filter(
				treeItemId => treeItemId !== itemId
			),
		}));
	}

	public isTreeCreated(itemId: string): boolean {
		return this.query.isTreeCreated(itemId);
	}

	public addCurrentPosition(position: string[] = []): void {
		this.store.update({
			currentPosition: position,
		});
	}

	public getCurrentPosition(): string[] {
		return this.query.getCurrentPosition();
	}
}

export const treeItemsFacade = new TreeItemsFacade(treeItemsStore, treesApiService, treeItemsQuery);
