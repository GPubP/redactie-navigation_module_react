import { LoadingState, useObservable } from '@redactie/utils';

import { TreeDetailModel, treesFacade } from '../../store/trees';

const useTree = (): [LoadingState, TreeDetailModel | undefined] => {
	const isFetching = useObservable(treesFacade.isFetchingOne$, LoadingState.Loading);
	const tree = useObservable(treesFacade.tree$);
	const error = useObservable(treesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : isFetching;

	return [loadingState, tree];
};

export default useTree;
