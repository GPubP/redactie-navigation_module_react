import { LoadingState, useObservable, useSiteContext } from '@redactie/utils';
import { isNil } from 'ramda';
import { useEffect, useState } from 'react';

import { TreeModel, treesFacade } from '../../store/trees';

const useTree = (treeId: number): [boolean, TreeModel | undefined] => {
	const { siteId } = useSiteContext();
	const [tree, setTree] = useState<TreeModel>();
	const isFetchingOne = useObservable(treesFacade.isFetchingOne$, LoadingState.Loading);
	const isLoading = isFetchingOne === LoadingState.Loading;

	useEffect(() => {
		if (isNil(treeId) || isNil(siteId)) {
			return;
		}

		const hasTree = treesFacade.hasTree(treeId);

		if (!hasTree) {
			treesFacade.fetchTree(siteId, treeId);
		}

		const treeSubscription = treesFacade.selectTree(treeId).subscribe(setTree);

		return () => {
			treeSubscription.unsubscribe();
		};
	}, [siteId, treeId]);

	return [isLoading, tree];
};

export default useTree;
