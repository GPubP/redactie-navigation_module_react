import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { TreeModel, TreesState } from './trees.model';
import { treesStore } from './trees.store';

export class TreesQuery extends BaseEntityQuery<TreesState> {
	public treeList$ = this.select(state => state.treeList).pipe(
		filter(treeList => !isNil(treeList), distinctUntilChanged())
	);

	public selectTree(treeId: number): Observable<TreeModel> {
		return this.selectEntity(treeId);
	}
}

export const treesQuery = new TreesQuery(treesStore);
