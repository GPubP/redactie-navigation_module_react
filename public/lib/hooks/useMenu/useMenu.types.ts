import { ContentTypeSchema } from '@redactie/content-module';
import { LoadingState } from '@redactie/utils';

import { Menu, MenuItem } from '../../services/menus';

export type UseMenu = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	removingState: LoadingState;
	menu: Menu | undefined;
	occurrences: ContentTypeSchema[] | undefined;
	menuItems: MenuItem[] | undefined;
	menuItemsCount: number | undefined;
};
