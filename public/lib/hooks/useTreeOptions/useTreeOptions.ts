import { LoadingState, useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { TreeOption } from '../../navigation.types';
import { treesFacade } from '../../store/trees';

const useTreeOptions = (canDelete: boolean): [LoadingState, TreeOption[]] => {
	const isFetching = useObservable(treesFacade.isFetching$, LoadingState.Loading);
	const [treeOptions, setTreeOptions] = useState<TreeOption[]>([]);
	const error = useObservable(treesFacade.error$, null);

	useEffect(() => {
		const subscriber = treesFacade.selectTreeOptions(canDelete).subscribe(setTreeOptions);

		return () => {
			subscriber.unsubscribe();
		};
	}, [canDelete]);

	const loadingState = error ? LoadingState.Error : isFetching;

	return [loadingState, treeOptions];
};

export default useTreeOptions;
