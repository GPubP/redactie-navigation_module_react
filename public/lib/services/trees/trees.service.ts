import { api } from '../api';

import {
	CreateTreeItemPayload,
	TreeDetail,
	TreeItem,
	TreesResponse,
	UpdateTreeItemPayload,
} from './trees.service.types';

export class TreesApiService {
	public async getTrees(): Promise<TreesResponse> {
		return await api.get('trees').json<TreesResponse>();
	}

	public async getTree(treeId: string): Promise<TreeDetail> {
		return await api.get(`trees/${treeId}`).json<TreeDetail>();
	}

	public async getTreeItem(treeId: string, treeItemId: string): Promise<TreeItem> {
		return await api.get(`trees/${treeId}/items/${treeItemId}`).json<TreeItem>();
	}

	public async createTreeItem(treeId: string, body: CreateTreeItemPayload): Promise<TreeItem> {
		return await api
			.post(`trees/${treeId}/items`, {
				json: body,
			})
			.json();
	}

	public async updateTreeItem(
		treeId: string,
		itemId: string,
		body: UpdateTreeItemPayload
	): Promise<TreeItem> {
		return await api
			.put(`trees/${treeId}/items/${itemId}`, {
				json: body,
			})
			.json();
	}
}

export const treesApiService = new TreesApiService();
