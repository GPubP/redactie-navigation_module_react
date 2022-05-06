import { LoadingState, useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

import { UseSiteStructure } from './useSiteStructure.types';

const useSiteStructure = (key: string): UseSiteStructure => {
	const isFetching$ = useMemo(() => siteStructuresFacade.selectItemIsFetching(key), [key]);
	const isFetching = useObservable(isFetching$, LoadingState.Loading);

	const siteStructure$ = useMemo(() => siteStructuresFacade.selectItemValue(key), [key]);
	const siteStructure = useObservable(siteStructure$) as SiteStructure;

	const error$ = useMemo(() => siteStructuresFacade.selectItemError(key), [key]);
	const error = useObservable(error$);

	const isUpdating$ = useMemo(() => siteStructuresFacade.selectItemIsUpdating(key), [key]);
	const isUpdating = useObservable(isUpdating$, LoadingState.Loaded);

	const isCreating$ = useMemo(() => siteStructuresFacade.selectItemIsCreating(key), [key]);
	const isCreating = useObservable(isCreating$, LoadingState.Loaded);

	const isRemoving$ = useMemo(() => siteStructuresFacade.selectItemIsRemoving(key), [key]);
	const isRemoving = useObservable(isRemoving$, LoadingState.Loaded);

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
