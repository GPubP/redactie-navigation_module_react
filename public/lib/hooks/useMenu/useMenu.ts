import { LoadingState, useObservable } from '@redactie/utils';

import { menusFacade } from '../../store/menus';

import { UseMenu } from './useMenu.types';

const useMenu = (): UseMenu => {
	const isFetching = useObservable(menusFacade.isFetchingOne$, LoadingState.Loading);
	const isUpdating = useObservable(menusFacade.isUpdating$, LoadingState.Loaded);
	const isCreating = useObservable(menusFacade.isCreating$, LoadingState.Loaded);
	const menu = useObservable(menusFacade.menu$);
	const error = useObservable(menusFacade.error$);

	const upsertingState = [isUpdating, isCreating].includes(LoadingState.Loading)
		? LoadingState.Loading
		: LoadingState.Loaded;

	const fetchingState = error ? LoadingState.Error : isFetching;

	return {
		fetchingState,
		upsertingState,
		menu,
	};
};

export default useMenu;
