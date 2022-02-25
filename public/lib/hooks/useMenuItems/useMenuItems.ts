import { useObservable } from '@mindspace-io/react';
import { LoadingState } from '@redactie/utils';

import { MenuItem } from '../../services/menuItems';
import { menuItemsFacade } from '../../store/menuItems';

const useMenuItems = (): [LoadingState, MenuItem[] | null | undefined] => {
	const [loading] = useObservable(menuItemsFacade.isFetching$, LoadingState.Loading);
	const [menuItems] = useObservable(menuItemsFacade.menuItems$, []);
	const [error] = useObservable(menuItemsFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, menuItems];
};

export default useMenuItems;
