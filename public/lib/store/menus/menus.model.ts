import { BaseEntityState } from '@redactie/utils';

import { Menu, MenuDetail } from '../../services/menus';

export type MenuListItemModel = Menu;
export type MenuModel = MenuDetail;
export interface MenusState extends BaseEntityState<MenuModel, number> {
	menuList?: MenuListItemModel[];
}
