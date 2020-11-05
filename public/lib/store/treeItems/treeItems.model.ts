import { BaseEntityState } from '@redactie/utils';

import { TreeItem } from '../../services/trees';

export type TreeItemModel = TreeItem;
export interface TreeItemsState extends BaseEntityState<TreeItemModel, string> {
	createdTreeItems: string[];
	currentPosition: string[];
}
