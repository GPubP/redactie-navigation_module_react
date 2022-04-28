import { LoadingState } from '@redactie/utils';

import { MenuItem } from '../../services/menuItems';

export type UseMenuItems = {
	fetchingState: LoadingState;
	fetchingOneState: LoadingState;
	upsertingState: LoadingState;
	removingState: LoadingState;
	menuItems: MenuItem[] | undefined;
};
