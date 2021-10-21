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
	public fetchTreeItem(
		siteId: string,
		treeId: number,
		treeItemId: number
	): Promise<TreeItem | void> {
		if (this.query.hasEntity(treeItemId)) {
			return Promise.resolve(this.getTreeItem(treeItemId));
		}

		this.store.setIsFetchingOne(true);

		return this.service
			.getTreeItem(siteId, treeId, treeItemId)
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

	public createTreeItem(
		siteId: string,
		treeId: number,
		body: CreateTreeItemPayload
	): Promise<TreeItem> {
		return this.service.createTreeItem(siteId, treeId, body).then(response => {
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
		siteId: string,
		treeId: number,
		itemId: number,
		body: UpdateTreeItemPayload
	): Promise<void> {
		return this.service.updateTreeItem(siteId, treeId, itemId, body).then(response => {
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

	public deleteTreeItem(siteId: string, treeId: number, itemId: number): Promise<void> {
		return this.service.deleteTreeItem(siteId, treeId, itemId).then(() => {
			return this.store.remove(itemId);
		});
	}

	public selectTreeItem(treeItemId: number): Observable<TreeItemModel> {
		return this.query.selectTreeItem(treeItemId);
	}

	public getTreeItem(treeItemId: number): TreeItemModel {
		return this.query.getTreeItem(treeItemId);
	}

	public hasTreeItem(treeItemId: number): boolean {
		return this.query.hasEntity(treeItemId);
	}

	public localUpdateTreeItem(itemId: number, body: UpdateTreeItemPayload): void {
		this.store.update(itemId, previousState => {
			return {
				...previousState,
				...body,
			};
		});
	}

	public removeFromCreatedTreeItems(itemId: number): void {
		this.store.update(previousState => ({
			createdTreeItems: previousState.createdTreeItems.filter(
				treeItemId => treeItemId !== itemId
			),
		}));
	}

	public isTreeCreated(itemId: number): boolean {
		return this.query.isTreeCreated(itemId);
	}

	public addPosition(itemId: number, position: number[] = []): void {
		this.store.update(prevState => ({
			...prevState,
			positions: {
				...position,
				[itemId]: position,
			},
		}));
	}

	public getPosition(itemId: number): number[] {
		return this.query.getPosition(itemId);
	}

	public setContentItemDepsHaveChanged(isChanged: boolean): void {
		this.store.update({
			contentItemDepsHaveChanged: isChanged,
		});
	}

	public getContentItemDepsHaveChanged(): boolean {
		return this.query.getContentItemDepsHaveChanged();
	}
}

export const treeItemsFacade = new TreeItemsFacade(treeItemsStore, treesApiService, treeItemsQuery);
