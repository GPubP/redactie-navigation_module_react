import { LoadingState } from '@redactie/utils';

import { Menu } from '../../services/menus';

export type UseMenu = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	menu: Menu | undefined;
	occurrences: Menu[] | undefined;
};
