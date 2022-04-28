import { LoadingState, useObservable } from '@redactie/utils';

import { menuItemsFacade } from '../../store/menuItems';

import { UseContentMenuItems } from './useContentMenuItems.type';

const useContentMenuItems = (): UseContentMenuItems => {
	const isFetching = useObservable(
		menuItemsFacade.isFetchingContentMenuItems$,
		LoadingState.Loading
	);
	const contentMenuItems = useObservable(menuItemsFacade.contentMenuItems$, []);
	const error = useObservable(menuItemsFacade.error$);

	const fetchingState = error
		? LoadingState.Error
		: isFetching === LoadingState.Loading
		? LoadingState.Loading
		: LoadingState.Loaded;

	return {
		fetchingState,
		contentMenuItems,
	};
};

export default useContentMenuItems;
