import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { TreeOption } from '../../navigation.types';

import { TreeModel, TreesState } from './trees.model';
import { treesStore } from './trees.store';

export class TreesQuery extends BaseEntityQuery<TreesState> {
	public treeList$ = this.select(state => state.treeList).pipe(
		filter(treeList => !isNil(treeList), distinctUntilChanged())
	);

	public selectTree(treeId: number): Observable<TreeModel> {
		return this.selectEntity(treeId);
	}

	public selectTreesOptions = (canDelete: boolean): Observable<TreeOption[]> =>
		this.treeList$.pipe(
			map(trees => {
				const newTrees = (trees || []).map(tree => ({
					label: tree.label,
					value: String(tree.id),
					key: `${tree.label}_${tree.id}`,
				}));
				if (canDelete) {
					newTrees.unshift({
						label: '<-- Selecteer een lege navigatieboom -->',
						value: '',
						key: `delete-tree`,
					});
				}
				return newTrees;
			})
		);
}

export const treesQuery = new TreesQuery(treesStore);
