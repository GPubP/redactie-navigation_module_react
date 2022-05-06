import { LoadingState, useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { NavItem } from '../../navigation.types';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

import { UseSiteStructureItems } from './useSiteStructureItems.type';

const useSiteStructureItems = (key: string): UseSiteStructureItems => {
	const isFetching$ = useMemo(() => siteStructureItemsFacade.selectItemIsFetching(key), [key]);
	const isFetching = useObservable(isFetching$, LoadingState.Loading);

	const siteStructureItems$ = useMemo(() => siteStructureItemsFacade.selectItemValue(key), [key]);
	const siteStructureItems = useObservable(siteStructureItems$, []);

	const isUpdating$ = useMemo(() => siteStructureItemsFacade.selectItemIsUpdating(key), [key]);
	const isUpdating = useObservable(isUpdating$, LoadingState.Loaded);

	const isCreating$ = useMemo(() => siteStructureItemsFacade.selectItemIsCreating(key), [key]);
	const isCreating = useObservable(isCreating$, LoadingState.Loaded);

	const isRemoving$ = useMemo(() => siteStructureItemsFacade.selectItemIsRemoving(key), [key]);
	const isRemoving = useObservable(isRemoving$, LoadingState.Loaded);

	const error$ = useMemo(() => siteStructureItemsFacade.selectItemError(key), [key]);
	const error = useObservable(error$);

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
		siteStructureItems: siteStructureItems as NavItem[],
	};
};

export default useSiteStructureItems;
