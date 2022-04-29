import { LoadingState } from '@redactie/utils';

import { MenuItem } from '../../services/menuItems';

export type UseContentMenuItems = {
	fetchingState: LoadingState;
	contentMenuItems: MenuItem[] | undefined;
};
