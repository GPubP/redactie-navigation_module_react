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

	public getTree(treeId: number): Promise<TreeDetail> {
		return api.get(`trees/${treeId}`).json<TreeDetail>();
	}

	public getTreeItem(treeId: number, treeItemId: number): Promise<TreeItem> {
		return api.get(`trees/${treeId}/items/${treeItemId}`).json<TreeItem>();
	}

	public createTreeItem(treeId: number, body: CreateTreeItemPayload): Promise<TreeItem> {
		return api
			.post(`trees/${treeId}/items`, {
				json: body,
			})
			.json();
	}

	public updateTreeItem(
		treeId: number,
		itemId: number,
		body: UpdateTreeItemPayload
	): Promise<TreeItem> {
		return api
			.put(`trees/${treeId}/items/${itemId}`, {
				json: body,
			})
			.json();
	}

	public deleteTreeItem(treeId: number, itemId: number): ResponsePromise {
		return api.delete(`trees/${treeId}/items/${itemId}`);
	}
}

export const treesApiService = new TreesApiService();
