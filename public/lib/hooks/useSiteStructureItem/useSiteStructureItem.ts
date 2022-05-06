import { LoadingState, useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { SiteStructureItem } from '../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

import { UseSiteStructureItem } from './useSiteStructureItem.types';

const useSiteStructureItem = (key: string): UseSiteStructureItem => {
	const isFetching$ = useMemo(() => siteStructureItemsFacade.selectItemIsFetching(key), [key]);
	const isFetching = useObservable(isFetching$, LoadingState.Loading);

	const siteStructureItem$ = useMemo(() => siteStructureItemsFacade.selectItemValue(key), [key]);
	const siteStructureItem = useObservable(siteStructureItem$) as SiteStructureItem;

	const error$ = useMemo(() => siteStructureItemsFacade.selectItemError(key), [key]);
	const error = useObservable(error$);

	const isUpdating$ = useMemo(() => siteStructureItemsFacade.selectItemIsUpdating(key), [key]);
	const isUpdating = useObservable(isUpdating$, LoadingState.Loaded);

	const isCreating$ = useMemo(() => siteStructureItemsFacade.selectItemIsCreating(key), [key]);
	const isCreating = useObservable(isCreating$, LoadingState.Loaded);

	const isRemoving$ = useMemo(() => siteStructureItemsFacade.selectItemIsRemoving(key), [key]);
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
		siteStructureItem,
	};
};

export default useSiteStructureItem;
