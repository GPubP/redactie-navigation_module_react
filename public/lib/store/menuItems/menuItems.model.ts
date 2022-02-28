import { BaseEntityState } from '@redactie/utils';

import { MenuItem } from '../../services/menuItems';

export interface InternalState {
	readonly menuItem: MenuItem | null;
}

export type MenuItemModel = MenuItem;

export interface MenuItemsState extends BaseEntityState<MenuItemModel, string> {
	menuItem?: MenuItemModel;
	menuItemDraft?: MenuItemModel;
}
