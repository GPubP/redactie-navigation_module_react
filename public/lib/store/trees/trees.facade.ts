import { BaseEntityFacade } from '@redactie/utils';
import { Observable } from 'rxjs';

import { treesApiService, TreesApiService } from '../../services/trees';

import { TreeModel } from './trees.model';
import { TreesQuery, treesQuery } from './trees.query';
import { TreesStore, treesStore } from './trees.store';

export class TreesFacade extends BaseEntityFacade<TreesStore, TreesApiService, TreesQuery> {
	public readonly treesList$ = this.query.treeList$;

	public selectTree(treeId: number): Observable<TreeModel> {
		return this.query.selectTree(treeId);
	}

	public hasTree(treeId: number): boolean {
		return this.query.hasEntity(treeId);
	}

	public fetchTreesList(siteId: string): void {
		const state = this.query.getValue();

		if (state.treeList && state.treeList.length > 0) {
			return;
		}
		this.store.setIsFetching(true);

		this.service
			.getTrees(siteId)
			.then(response => {
				const resourceList = response?._embedded?.resourceList;
				if (resourceList) {
					this.store.update({
						treeList: resourceList,
						isFetching: false,
					});
				}
			})
			.catch(error => {
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public fetchTree(siteId: string, treeId: number, forceUpdate = false): void {
		if (this.query.hasEntity(treeId) && !forceUpdate) {
			return;
		}

		this.store.setIsFetchingOne(true);

		this.service
			.getTree(siteId, treeId)
			.then(response => {
				if (response) {
					this.store.upsert(treeId, response);
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
}

export const treesFacade = new TreesFacade(treesStore, treesApiService, treesQuery);
