import { LoadingState } from '@redactie/utils';

import { MenuSchema } from '../../services/menus';

export type UseMenu = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	menu: MenuSchema | undefined;
};
