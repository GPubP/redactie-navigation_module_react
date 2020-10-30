import { ListApiResponse } from '../../navigation.types';

export type TreesResponse = ListApiResponse<Embedded>;

export interface Embedded {
	resourceList: TreeResponse[];
}

export interface TreeResponse {
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

export interface TreeDetailItemResponse {
	id: string;
	label: string;
	description: string;
	publishStatus: string;
	slug: string;
	externalUrl: string;
	items: TreeDetailItemResponse[];
}

export interface CreateTreeItemPayload {
	externalUrl: string;
	slug: string;
	linkedTreeId?: string;
	description: string;
	label: string;
	parentId?: string;
	publishStatus: string;
}

export interface CreateTreeItemResponse {
	id: string;
	slug: string;
	externalUrl: string;
	linkedTreeId: string;
	description: string;
	label: string;
	publishStatus: string;
}

export type UpdateTreeItemResponse = CreateTreeItemResponse;

export type UpdateTreeItemPayload = CreateTreeItemPayload;

export interface TreeDetailResponse extends TreeResponse {
	items: TreeDetailItemResponse[];
}

export interface TreeCategory {
	id: number;
	label: string;
}

export interface TreeMeta {
	lastEditor: null;
}
