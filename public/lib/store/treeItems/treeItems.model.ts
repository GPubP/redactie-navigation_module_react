import { BaseEntityState } from '@redactie/utils';

import { TreeItem } from '../../services/trees';

export type TreeItemModel = TreeItem;
export type TreeItemsState = BaseEntityState<TreeItemModel, string>;
