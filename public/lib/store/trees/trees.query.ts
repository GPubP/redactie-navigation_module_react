import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { TreesState } from './trees.model';
import { treesStore } from './trees.store';

export class TreesQuery extends BaseEntityQuery<TreesState> {
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public trees$ = this.selectAll();
	public tree$ = this.select(state => state.tree).pipe(
		filter(tree => !isNil(tree), distinctUntilChanged())
	);

	public treesOptions$ = this.trees$.pipe(
		map(trees => {
			const newTrees = trees.map(tree => ({
				label: tree.label,
				value: String(tree.id),
				key: `${tree.label}_${tree.id}`,
			}));
			newTrees.unshift({
				label: '<-- Selecteer een lege navigatieboom -->',
				value: '',
				key: `default-value`,
			});
			return newTrees;
		})
	);
}

export const treesQuery = new TreesQuery(treesStore);
