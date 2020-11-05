import { BaseEntityFacade } from '@redactie/utils';
import { Observable } from 'rxjs';

import { treesApiService, TreesApiService } from '../../services/trees';

import { TreeModel } from './trees.model';
import { TreesQuery, treesQuery } from './trees.query';
import { TreesStore, treesStore } from './trees.store';

export class TreesFacade extends BaseEntityFacade<TreesStore, TreesApiService, TreesQuery> {
	public readonly treesList$ = this.query.treeList$;
	public readonly treesOptions$ = this.query.treesOptions$;

	public selectTree(treeId: string): Observable<TreeModel> {
		return this.query.selectTree(treeId);
	}

	public getTreesList(): void {
		this.store.setIsFetching(true);

		this.service
			.getTrees()
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

	public getTree(treeId: string): void {
		this.store.setIsFetchingOne(true);

		this.service
			.getTree(treeId)
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
