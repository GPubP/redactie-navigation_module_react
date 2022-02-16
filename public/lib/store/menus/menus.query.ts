import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinct, distinctUntilChanged, filter } from 'rxjs/operators';

import { MenusState } from './menus.model';
import { menusStore } from './menus.store';

export class MenusQuery extends BaseEntityQuery<MenusState> {
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public menus$ = this.selectAll();
	public menu$ = this.select(state => state.menu).pipe(
		filter(menu => !isNil(menu), distinctUntilChanged())
	);
	public menuDraft$ = this.select(state => state.menuDraft).pipe(
		filter(menuDraft => !isNil(menuDraft), distinctUntilChanged())
	);
	public occurrences$ = this.select(state => state.occurrences).pipe(
		filter(occurrences => !isNil(occurrences), distinctUntilChanged())
	);
	public isFetchingOccurrences$ = this.select(state => state.isFetchingOccurrences).pipe(
		occurrences => occurrences,
		distinctUntilChanged()
	)
}

export const menusQuery = new MenusQuery(menusStore);
