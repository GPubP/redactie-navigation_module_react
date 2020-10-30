import { LoadingState, useObservable } from '@redactie/utils';

import { treesFacade } from '../../store/trees';

const useTreesOptions = (): [LoadingState, { label: string; value: string; key: string }[]] => {
	const isFetching = useObservable(treesFacade.isFetching$, LoadingState.Loading);
	const treesOptions = useObservable(treesFacade.treesOptions$, []);
	const error = useObservable(treesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : isFetching;

	return [loadingState, treesOptions];
};

export default useTreesOptions;
