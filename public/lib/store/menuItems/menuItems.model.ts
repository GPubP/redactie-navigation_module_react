import { BaseEntityState } from '@redactie/utils';

import { MenuItem } from '../../services/menuItems';

export interface InternalState {
	readonly menuItem: MenuItem | null;
}

export interface PendingMenuItems {
	upsertItems: MenuItemModel[];
	deleteItems: {
		id: number;
		treeId: number;
	}[];
}

export type MenuItemModel = MenuItem;

export interface MenuItemsState extends BaseEntityState<MenuItemModel, string> {
	menuItem?: MenuItemModel;
	menuItemDraft?: MenuItemModel;
	pendingMenuItems?: PendingMenuItems;
	subsetMenuItems?: MenuItemModel[];
	isFetchingSubset: boolean;
}
