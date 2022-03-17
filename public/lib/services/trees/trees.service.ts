import { ResponsePromise } from 'ky';

import { api } from '../api';

import {
	CreateTreeItemPayload,
	ErrorResponse,
	TreeDetail,
	TreeItem,
	TreesResponse,
	UpdateTreeItemPayload,
} from './trees.service.types';

export class TreesApiService {
	public getTrees(siteId: string): Promise<TreesResponse> {
		return api.get(`${siteId}/trees`).json<TreesResponse>();
	}

	public getTree(siteId: string, treeId: number): Promise<TreeDetail> {
		return api.get(`${siteId}/trees/${treeId}`).json<TreeDetail>();
	}

	public async getTreeItem(
		siteId: string,
		treeId: number,
		treeItemId: number
	): Promise<TreeItem> {
		const item = await api
			.get(`${siteId}/trees/${treeId}/items/${treeItemId}`)
			.json<TreeItem | ErrorResponse>();

		if ((item as ErrorResponse)?.status === 404) {
			throw new Error('NotFound');
		}

		return item as TreeItem;
	}

	public createTreeItem(
		siteId: string,
		treeId: number,
		body: CreateTreeItemPayload
	): Promise<TreeItem> {
		return api
			.post(`${siteId}/trees/${treeId}/items`, {
				json: body,
			})
			.json();
	}

	public updateTreeItem(
		siteId: string,
		treeId: number,
		itemId: number,
		body: UpdateTreeItemPayload
	): Promise<TreeItem> {
		return api
			.put(`${siteId}/trees/${treeId}/items/${itemId}`, {
				json: body,
			})
			.json();
	}

	public deleteTreeItem(siteId: string, treeId: number, itemId: number): ResponsePromise {
		return api.delete(`${siteId}/trees/${treeId}/items/${itemId}`);
	}
}

export const treesApiService = new TreesApiService();
