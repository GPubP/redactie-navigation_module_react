import { ResponsePromise } from 'ky';

import { api } from '../api';

import {
	CreateTreeItemPayload,
	TreeDetail,
	TreeItem,
	TreesResponse,
	UpdateTreeItemPayload,
} from './trees.service.types';

export class TreesApiService {
	public getTrees(): Promise<TreesResponse> {
		return api.get('trees').json<TreesResponse>();
	}

	public getTree(treeId: string): Promise<TreeDetail> {
		return api.get(`trees/${treeId}`).json<TreeDetail>();
	}

	public getTreeItem(treeId: string, treeItemId: string): Promise<TreeItem> {
		return api.get(`trees/${treeId}/items/${treeItemId}`).json<TreeItem>();
	}

	public createTreeItem(treeId: string, body: CreateTreeItemPayload): Promise<TreeItem> {
		return api
			.post(`trees/${treeId}/items`, {
				json: body,
			})
			.json();
	}

	public updateTreeItem(
		treeId: string,
		itemId: string,
		body: UpdateTreeItemPayload
	): Promise<TreeItem> {
		return api
			.put(`trees/${treeId}/items/${itemId}`, {
				json: body,
			})
			.json();
	}

	public deleteTreeItem(treeId: string, itemId: string): ResponsePromise {
		return api.delete(`trees/${treeId}/items/${itemId}`);
	}
}

export const treesApiService = new TreesApiService();
