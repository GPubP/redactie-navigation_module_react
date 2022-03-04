import { LoadingState, useObservable } from '@redactie/utils';

import { menuItemsFacade } from '../../store/menuItems';

import { UseMenuItems } from './useMenuItems.type';

const useMenuItems = (): UseMenuItems => {
	const isFetching = useObservable(menuItemsFacade.isFetching$, LoadingState.Loading);
	const isUpdating = useObservable(menuItemsFacade.isUpdating$, LoadingState.Loaded);
	const isCreating = useObservable(menuItemsFacade.isCreating$, LoadingState.Loaded);
	const isRemoving = useObservable(menuItemsFacade.isRemoving$, LoadingState.Loaded);
	const menuItems = useObservable(menuItemsFacade.menuItems$, []);
	const error = useObservable(menuItemsFacade.error$);

	const upsertingState = [isUpdating, isCreating].includes(LoadingState.Loading)
		? LoadingState.Loading
		: LoadingState.Loaded;

	const fetchingState = error
		? LoadingState.Error
		: isFetching === LoadingState.Loading
		? LoadingState.Loading
		: LoadingState.Loaded;

	const removingState =
		isRemoving === LoadingState.Loading ? LoadingState.Loading : LoadingState.Loaded;

	return {
		fetchingState,
		upsertingState,
		removingState,
		menuItems,
	};
};

export default useMenuItems;
