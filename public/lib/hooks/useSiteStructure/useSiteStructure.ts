import { LoadingState, useObservable } from '@redactie/utils';

import { siteStructuresFacade } from '../../store/siteStructures';

import { UseSiteStructure } from './useSiteStructure.types';

const useSiteStructure = (): UseSiteStructure => {
	const isFetching = useObservable(siteStructuresFacade.isFetchingOne$, LoadingState.Loading);
	const isUpdating = useObservable(siteStructuresFacade.isUpdating$, LoadingState.Loaded);
	const isCreating = useObservable(siteStructuresFacade.isCreating$, LoadingState.Loaded);
	const isRemoving = useObservable(siteStructuresFacade.isRemoving$, LoadingState.Loaded);
	const siteStructure = useObservable(siteStructuresFacade.siteStructure$);
	const error = useObservable(siteStructuresFacade.error$);

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
		siteStructure,
	};
};

export default useSiteStructure;
