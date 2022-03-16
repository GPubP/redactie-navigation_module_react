import { LoadingState, useObservable } from '@redactie/utils';

import { siteStructureItemsFacade } from '../../store/siteStructureItems';

import { UseSiteStructureItem } from './useSiteStructureItem.types';

const useSiteStructureItem = (): UseSiteStructureItem => {
	const isFetching = useObservable(siteStructureItemsFacade.isFetchingOne$, LoadingState.Loading);
	const isUpdating = useObservable(siteStructureItemsFacade.isUpdating$, LoadingState.Loaded);
	const isCreating = useObservable(siteStructureItemsFacade.isCreating$, LoadingState.Loaded);
	const isRemoving = useObservable(siteStructureItemsFacade.isRemoving$, LoadingState.Loaded);
	const siteStructureItem = useObservable(siteStructureItemsFacade.siteStructureItem$);
	const error = useObservable(siteStructureItemsFacade.error$);

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
		siteStructureItem,
	};
};

export default useSiteStructureItem;
