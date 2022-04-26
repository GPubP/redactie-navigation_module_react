import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { MenuItemsState } from './menuItems.model';
import { menuItemsStore } from './menuItems.store';

export class MenuItemsQuery extends BaseEntityQuery<MenuItemsState> {
	public menuItems$ = this.selectAll();
	public menuItem$ = this.select(state => state.menuItem).pipe(
		filter(menuItem => !isNil(menuItem), distinctUntilChanged())
	);
	public pendingMenuItems$ = this.select(state => state.pendingMenuItems);
	public menuItemDraft$ = this.select(state => state.menuItemDraft).pipe(
		filter(menuItemDraft => !isNil(menuItemDraft), distinctUntilChanged())
	);
	public contentMenuItems$ = this.select(state => state.contentMenuItems);
	public isFetchingContentMenuItems$ = this.select(
		state => state.isFetchingContentMenuItems
	).pipe(map(this.convertBoolToLoadingState), distinctUntilChanged());
}

export const menuItemsQuery = new MenuItemsQuery(menuItemsStore);
