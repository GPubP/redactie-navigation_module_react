import { BaseEntityState, Page } from '@redactie/utils';

import { MenuSchema } from '../../services/menus';

export interface InternalState {
	readonly menu: MenuSchema | null;
}

export type MenuModel = MenuSchema;

export interface MenusState extends BaseEntityState<MenuModel, string> {
	meta?: Page;
	menu?: MenuModel;
	menuDraft?: MenuModel;
}
