import { LoadingState } from '@redactie/utils';

import { MenuItem } from '../../services/menuItems';

export type UseMenuItems = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	removingState: LoadingState;
	menuItems: MenuItem[] | undefined;
};
