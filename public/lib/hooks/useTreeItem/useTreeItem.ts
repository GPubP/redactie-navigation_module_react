import { LoadingState, useObservable } from '@redactie/utils';
import { of } from 'rxjs';

import { TreeItemModel, treeItemsFacade } from '../../store/treeItems';

const useTreeItem = (treeItemId: string): TreeItemModel | undefined => {
	const treeItem = useObservable(
		treeItemId !== undefined && treeItemId !== null
			? treeItemsFacade.selectTreeItem(treeItemId)
			: of(undefined)
	);

	return treeItem;
};

export default useTreeItem;
