import { isNil } from '@datorama/akita';
import { BaseMultiEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { MenusState } from './menus.model';
import { menusStore } from './menus.store';

export class MenusQuery extends BaseMultiEntityQuery<MenusState> {
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public menus$ = this.selectAll();
	public menu$ = this.select(state => state.menu).pipe(
		filter(menu => !isNil(menu), distinctUntilChanged())
	);
	public cachedMenus$ = this.select(state => state.cachedMenus).pipe(
		filter(menu => !isNil(menu), distinctUntilChanged())
	);
	public menuDraft$ = this.select(state => state.menuDraft).pipe(
		filter(menuDraft => !isNil(menuDraft), distinctUntilChanged())
	);
	public occurrences$ = this.select(state => state.occurrences).pipe(
		filter(occurrences => !isNil(occurrences), distinctUntilChanged())
	);
	public isFetchingOne$ = this.select(state => state.isFetchingOne).pipe(
		map(this.convertBoolToLoadingState)
	);
	public isRemovingOne$ = this.select(state => state.isRemovingOne).pipe(
		map(this.convertBoolToLoadingState)
	);
	public error$ = this.select(state => state.error).pipe(
		filter(error => !isNil(error), distinctUntilChanged())
	);
	public isFetchingOccurrences$ = this.select(state => state.isFetchingOccurrences).pipe(
		occurrences => occurrences,
		distinctUntilChanged()
	);
}

export const menusQuery = new MenusQuery(menusStore);
