import { BaseEntityState } from '@redactie/utils';

import { Tree, TreeDetail } from '../../services/trees';

export type TreeListItemModel = Tree;
export type TreeModel = TreeDetail;
export interface TreesState extends BaseEntityState<TreeModel, number> {
	treeList?: TreeListItemModel[];
}
