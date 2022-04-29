import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { MenuItemModel, MenuItemsState } from './menuItems.model';

@StoreConfig({ name: 'menuItems', idKey: 'id' })
export class MenuItemsStore extends BaseEntityStore<MenuItemsState, MenuItemModel> {}

export const menuItemsStore = new MenuItemsStore({
	pendingMenuItems: {
		upsertItems: [],
		deleteItems: [],
	},
});
