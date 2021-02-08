import { BaseEntityState } from '@redactie/utils';

import { TreeItem } from '../../services/trees';

export type TreeItemModel = TreeItem;
export interface TreeItemsState extends BaseEntityState<TreeItemModel, number> {
	createdTreeItems: number[];
	positions: Record<number, number[]>;
	slugIsChanged: boolean;
}
