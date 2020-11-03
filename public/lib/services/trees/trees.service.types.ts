import { ListApiResponse } from '../../navigation.types';

/**
 * Trees
 */

/////////////////////////////////
// GET TREES TYPES ---------------------
/////////////////////////////////
export type TreesResponse = ListApiResponse<Embedded>;

export interface Embedded {
	resourceList: Tree[];
}

export interface Tree {
	id: number;
	logicalId: string;
	label: string;
	description: string;
	category: TreeCategory;
	publishStatus: string;
	createdBy: string;
	createdAt: Date;
	updatedBy: string;
	updatedAt: Date;
	slug: string;
	meta: TreeMeta;
}

export interface TreeCategory {
	id: number;
	label: string;
}

export interface TreeMeta {
	lastEditor: null;
}
///////////////////////////////////////
// GET TREE TYPES ---------------------
///////////////////////////////////////
export interface TreeDetail extends Tree {
	items: TreeDetailItem[];
}

export interface TreeDetailItem {
	id: string;
	label: string;
	description: string;
	publishStatus: string;
	slug: string;
	externalUrl?: string;
	items: TreeDetailItem[];
}

///////////////////////////////////////
// GET TREE ITEM TYPES ----------------
///////////////////////////////////////
export interface TreeItem extends Omit<TreeDetailItem, 'items'> {
	parentId?: string;
}

///////////////////////////////////////
// CREATE TREE ITEM TYPES -------------
///////////////////////////////////////

export type CreateTreeItemPayload = Omit<TreeItem, 'id'>;

///////////////////////////////////////
// UPDATE TREE ITEM TYPES -------------
///////////////////////////////////////

export type UpdateTreeItemPayload = CreateTreeItemPayload;
