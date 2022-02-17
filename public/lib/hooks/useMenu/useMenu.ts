import { LoadingState, useObservable } from '@redactie/utils';

import { menusFacade } from '../../store/menus';

import { UseMenu } from './useMenu.types';

const useMenu = (): UseMenu => {
	const isFetching = useObservable(menusFacade.isFetchingOne$, LoadingState.Loading);
	const isUpdating = useObservable(menusFacade.isUpdating$, LoadingState.Loaded);
	const isCreating = useObservable(menusFacade.isCreating$, LoadingState.Loaded);
	const isRemoving = useObservable(menusFacade.isRemoving$, LoadingState.Loaded);
	const menu = useObservable(menusFacade.menu$);
	const occurrences = useObservable(menusFacade.occurrences$);
	const menuItems = useObservable(menusFacade.menuItems$);
	const menuItemsCount = useObservable(menusFacade.menuItemsCount$);
	const isFetchingOccurrences = useObservable(
		menusFacade.isFetchingOccurrences$,
		LoadingState.Loading
	);
	const isFetchingMenuItems = useObservable(
		menusFacade.isFetchingMenuItems$,
		LoadingState.Loading
	);
	const error = useObservable(menusFacade.error$);

	const upsertingState = [isUpdating, isCreating].includes(LoadingState.Loading)
		? LoadingState.Loading
		: LoadingState.Loaded;

	const fetchingState = error
		? LoadingState.Error
		: [isFetching, isFetchingOccurrences, isFetchingMenuItems].includes(LoadingState.Loading)
			? LoadingState.Loading
			: LoadingState.Loaded;

	const removingState =
		isRemoving === LoadingState.Loading ? LoadingState.Loading : LoadingState.Loaded;

	return {
		fetchingState,
		upsertingState,
		removingState,
		menu,
		occurrences,
		menuItems,
		menuItemsCount,
	};
};

export default useMenu;
