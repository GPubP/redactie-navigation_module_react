import { LoadingState, useObservable, useSiteContext } from '@redactie/utils';
import { isNil } from 'ramda';
import { useEffect, useState } from 'react';

import { TreeItemModel, treeItemsFacade } from '../../store/treeItems';

const useTreeItem = (treeId: number, treeItemId: number): [boolean, TreeItemModel | undefined] => {
	const { siteId } = useSiteContext();
	const [treeItem, setTreeItem] = useState<TreeItemModel>();
	const isFetchingOne = useObservable(treeItemsFacade.isFetchingOne$, LoadingState.Loading);
	const isLoading = isFetchingOne === LoadingState.Loading;

	useEffect(() => {
		if (isNil(treeItemId) || isNil(treeId)) {
			return;
		}

		const hasTreeItem = treeItemsFacade.hasTreeItem(treeItemId);

		if (!hasTreeItem) {
			treeItemsFacade.fetchTreeItem(siteId, treeId, treeItemId);
		}

		const treeItemSubscription = treeItemsFacade
			.selectTreeItem(treeItemId)
			.subscribe(setTreeItem);

		return () => {
			treeItemSubscription.unsubscribe();
		};
	}, [siteId, treeId, treeItemId]);

	return [isLoading, treeItem];
};

export default useTreeItem;
