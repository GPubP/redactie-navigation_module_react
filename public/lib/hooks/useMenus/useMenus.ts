import { LoadingState, Page, useObservable } from '@redactie/utils';

import { Menu } from '../../services/menus';
import { menusFacade } from '../../store/menus';

const useMenus = (): [LoadingState, Menu[] | null | undefined, Page | null | undefined] => {
	const loading = useObservable(menusFacade.isFetching$, LoadingState.Loading);
	const menus = useObservable(menusFacade.menus$, []);
	const menuPaging = useObservable(menusFacade.meta$, null);
	const error = useObservable(menusFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, menus, menuPaging];
};

export default useMenus;
