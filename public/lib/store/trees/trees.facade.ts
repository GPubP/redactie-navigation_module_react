import { BaseEntityFacade } from '@redactie/utils';

import {
	CreateTreeItemPayload,
	CreateTreeItemResponse,
	treesApiService,
	TreesApiService,
	UpdateTreeItemPayload,
	UpdateTreeItemResponse,
} from '../../services/trees';

import { TreesQuery, treesQuery } from './trees.query';
import { TreesStore, treesStore } from './trees.store';

export class TreesFacade extends BaseEntityFacade<TreesStore, TreesApiService, TreesQuery> {
	public readonly meta$ = this.query.meta$;
	public readonly trees$ = this.query.trees$;
	public readonly tree$ = this.query.tree$;
	public readonly treesOptions$ = this.query.treesOptions$;

	public getTrees(): void {
		this.store.setIsFetching(true);

		this.service
			.getTrees()
			.then(response => {
				const resourceList = response?._embedded?.resourceList;
				if (resourceList) {
					this.store.set(resourceList);
					this.store.setIsFetching(false);
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public getTree(treeId: string): void {
		this.store.setIsFetchingOne(true);

		this.service
			.getTree(treeId)
			.then(response => {
				if (response) {
					this.store.update({
						tree: response,
						isFetchingOne: false,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetchingOne: false,
				});
			});
	}

	public createTreeItem(
		treeId: string,
		body: CreateTreeItemPayload
	): Promise<CreateTreeItemResponse> {
		return this.service.createTreeItem(treeId, body);
	}

	public updateTreeItem(
		treeId: string,
		itemId: string,
		body: UpdateTreeItemPayload
	): Promise<UpdateTreeItemResponse> {
		return this.service.updateTreeItem(treeId, itemId, body);
	}
}

export const treesFacade = new TreesFacade(treesStore, treesApiService, treesQuery);
