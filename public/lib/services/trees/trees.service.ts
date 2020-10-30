import { api } from '../api';

import {
	CreateTreeItemPayload,
	CreateTreeItemResponse,
	TreeDetailResponse,
	TreesResponse,
	UpdateTreeItemPayload,
	UpdateTreeItemResponse,
} from './trees.service.types';

export class TreesApiService {
	public async getTrees(): Promise<TreesResponse> {
		return await api.get('trees').json<TreesResponse>();
	}

	public async getTree(treeId: string): Promise<TreeDetailResponse> {
		return await api.get(`trees/${treeId}`).json<TreeDetailResponse>();
	}

	public async createTreeItem(
		treeId: string,
		body: CreateTreeItemPayload
	): Promise<CreateTreeItemResponse> {
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
	): Promise<UpdateTreeItemResponse> {
		return await api
			.put(`trees/${treeId}/items/${itemId}`, {
				json: body,
			})
			.json();
	}
}

export const treesApiService = new TreesApiService();
