import { LoadingState, useObservable } from '@redactie/utils';
import { of } from 'rxjs';

import { TreeModel, treesFacade } from '../../store/trees';

const useTree = (treeId: number): [LoadingState, TreeModel | undefined] => {
	const isFetching = useObservable(treesFacade.isFetchingOne$, LoadingState.Loading);
	const tree = useObservable(
		treeId !== undefined && treeId !== null ? treesFacade.selectTree(treeId) : of(undefined)
	);
	const error = useObservable(treesFacade.error$, null);

	const loadingState = error ? LoadingState.Error : isFetching;

	return [loadingState, tree];
};

export default useTree;
