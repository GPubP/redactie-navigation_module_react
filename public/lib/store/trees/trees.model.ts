import { BaseEntityState } from '@redactie/utils';

import { TreeDetailResponse, TreeResponse } from '../../services/trees';

export type TreeModel = TreeResponse;
export type TreeDetailModel = TreeDetailResponse;
export interface TreesState extends BaseEntityState<TreeModel, string> {
	tree?: TreeDetailModel;
}
