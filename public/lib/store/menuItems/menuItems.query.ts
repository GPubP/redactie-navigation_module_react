import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { equals } from 'ramda';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { MenuItemsState } from './menuItems.model';
import { menuItemsStore } from './menuItems.store';

export class MenuItemsQuery extends BaseEntityQuery<MenuItemsState> {
	public menuItems$ = this.selectAll();
	public menuItem$ = this.select(state => state.menuItem).pipe(
		filter(menuItem => !isNil(menuItem), distinctUntilChanged())
	);
	public menuItemDraft$ = this.select(state => state.menuItemDraft).pipe(
		filter(
			menuItemDraft => !isNil(menuItemDraft),
			// TODO: Figure out why this is needed to not trigger the leave prompt on menu item create/update
			distinctUntilChanged((a, b) => equals(a, b))
		)
	);
}

export const menuItemsQuery = new MenuItemsQuery(menuItemsStore);
