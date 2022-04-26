import { StoreConfig } from '@datorama/akita';
import { BaseMultiEntityStore } from '@redactie/utils';

import { MenusState } from './menus.model';

@StoreConfig({ name: 'menus', idKey: 'id' })
export class MenusStore extends BaseMultiEntityStore<MenusState> {
	constructor(initialState: Partial<MenusState>) {
		super(initialState);
	}

	public setIsFetchingOne(isFetchingOne: boolean): void {
		this.update({ isFetchingOne });
	}

	public setIsRemoving(isRemoving: boolean): void {
		this.update({ isRemoving });
	}
}

export const menusStore = new MenusStore({});
