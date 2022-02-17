import { StoreConfig } from '@datorama/akita';
import { BaseEntityStore } from '@redactie/utils';

import { MenuModel, MenusState } from './menus.model';

@StoreConfig({ name: 'menus', idKey: 'uuid' })
export class MenusStore extends BaseEntityStore<MenusState, MenuModel> { }

export const menusStore = new MenusStore();
