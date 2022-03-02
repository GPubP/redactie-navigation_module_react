import { LoadingState } from '@redactie/utils';

import { MenuItem } from '../../services/menuItems';

export type UseMenuItem = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	removingState: LoadingState;
	menuItem: MenuItem | undefined;
};
