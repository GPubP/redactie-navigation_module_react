import { ContentTypeSchema } from '@redactie/content-module';
import { BaseMultiEntityState, LoadingState, Page } from '@redactie/utils';

import { Menu } from '../../services/menus';

export interface InternalState {
	readonly menu: Menu | null;
}

export type MenuModel = Menu[];

export interface MenusState extends BaseMultiEntityState<MenuModel, string> {
	meta?: Page;
	menu?: Menu;
	menuDraft?: Menu;
	occurrences?: ContentTypeSchema[];
	isFetchingOccurrences: LoadingState;
	isFetchingOne: boolean;
	isRemoving?: boolean;
}
