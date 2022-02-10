import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { MenuModel, MenusState } from './menus.model';
import { menusStore } from './menus.store';

export class MenusQuery extends BaseEntityQuery<MenusState> {
	public menuList$ = this.select(state => state.menuList).pipe(
		filter(menuList => !isNil(menuList), distinctUntilChanged())
	);

	public selectMenu(menuId: number): Observable<MenuModel> {
		return this.selectEntity(menuId);
	}
}

export const menusQuery = new MenusQuery(menusStore);
