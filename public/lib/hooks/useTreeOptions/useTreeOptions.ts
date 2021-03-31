import { LoadingState, useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { NavigationSecurityRights, TreeOption } from '../../navigation.types';
import { treesFacade } from '../../store/trees';

const useTreeOptions = (
	navigationRights: NavigationSecurityRights,
	treeItemId: string
): [LoadingState, TreeOption[]] => {
	const isFetching = useObservable(treesFacade.isFetching$, LoadingState.Loading);
	const [treeOptions, setTreeOptions] = useState<TreeOption[]>([]);
	const error = useObservable(treesFacade.error$, null);

	useEffect(() => {
		const subscriber = treesFacade
			.selectTreeOptions(navigationRights, treeItemId)
			.subscribe(setTreeOptions);

		return () => {
			subscriber.unsubscribe();
		};
	}, [navigationRights, treeItemId]);

	const loadingState = error ? LoadingState.Error : isFetching;

	return [loadingState, treeOptions];
};

export default useTreeOptions;
