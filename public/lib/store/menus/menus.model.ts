import { BaseEntityState, Page } from '@redactie/utils';

import { Menu } from '../../services/menus';

export interface InternalState {
	readonly menu: Menu | null;
}

export type MenuModel = Menu;

export interface MenusState extends BaseEntityState<MenuModel, string> {
	meta?: Page;
	menu?: MenuModel;
	menuDraft?: MenuModel;
}
