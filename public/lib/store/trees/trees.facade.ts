import { BaseEntityFacade } from '@redactie/utils';
import { Observable } from 'rxjs';

import { NavigationSecurityRights, TreeOption } from '../../navigation.types';
import { treesApiService, TreesApiService } from '../../services/trees';

import { TreeModel } from './trees.model';
import { TreesQuery, treesQuery } from './trees.query';
import { TreesStore, treesStore } from './trees.store';

export class TreesFacade extends BaseEntityFacade<TreesStore, TreesApiService, TreesQuery> {
	public readonly treesList$ = this.query.treeList$;

	public selectTree(treeId: number): Observable<TreeModel> {
		return this.query.selectTree(treeId);
	}

	public selectTreeOptions(
		navigationRights: NavigationSecurityRights,
		treeItemId: string
	): Observable<TreeOption[]> {
		return this.query.selectTreesOptions(navigationRights, treeItemId);
	}

	public getTreesList(siteId: string): void {
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

	public getTree(siteId: string, treeId: number): void {
		if (this.query.hasEntity(treeId)) {
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
