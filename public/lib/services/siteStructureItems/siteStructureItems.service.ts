import { SearchParams } from '@redactie/utils';

import { RearrangeNavItem } from '../../navigation.types';
import { api } from '../api';

import { SiteStructureItem, SiteStructureItemsResponse } from './siteStructureItems.service.types';

export class SiteStructureItemsApiService {
	public async getSiteStructureItems(
		siteId: string,
		siteStructureId: string,
		searchParams: SearchParams
	): Promise<SiteStructureItemsResponse> {
		return api
			.get(`${siteId}/site-structures/${siteStructureId}/items`, {
				searchParams,
			})
			.json();
	}

	public async getSiteStructureItemsForCT(
		siteId: string,
		contentTypeId: string,
		searchParams: SearchParams
	): Promise<SiteStructureItemsResponse> {
		return api
			.get(`${siteId}/content-types/${contentTypeId}/site-structure-items`, {
				searchParams,
			})
			.json();
	}

	public async getSubset(
		siteId: string,
		siteStructureId: string,
		startitem: number,
		depth: number
	): Promise<SiteStructureItemsResponse> {
		return api
			.get(`${siteId}/site-structures/${siteStructureId}/subset`, {
				searchParams: {
					startitem,
					depth,
				},
			})
			.json();
	}

	public async getSiteStructureItem(
		siteId: string,
		siteStructureId: string,
		id: string
	): Promise<SiteStructureItem> {
		return api.get(`${siteId}/site-structures/${siteStructureId}/items/${id}`).json();
	}

	public async createSiteStructureItem(
		siteId: string,
		siteStructureId: string,
		siteStructureItem: SiteStructureItem
	): Promise<SiteStructureItem> {
		return api
			.post(`${siteId}/site-structures/${siteStructureId}/items`, {
				json: siteStructureItem,
			})
			.json();
	}

	public async updateSiteStructureItem(
		siteId: string,
		siteStructureId: string,
		siteStructureItem: SiteStructureItem
	): Promise<SiteStructureItem> {
		return api
			.put(`${siteId}/site-structures/${siteStructureId}/items/${siteStructureItem.id}`, {
				json: siteStructureItem,
			})
			.json();
	}

	public async rearrangeSiteStructureItems(
		siteId: string,
		siteStructureId: string,
		rearrangeItems: RearrangeNavItem[]
	): Promise<Response> {
		return api.post(`${siteId}/site-structures/${siteStructureId}/items/rearrange`, {
			json: rearrangeItems,
		});
	}

	public async deleteSiteStructureItem(
		siteId: string,
		siteStructureId: string,
		siteStructureItem: SiteStructureItem
	): Promise<Response> {
		return api.delete(
			`${siteId}/site-structures/${siteStructureId}/items/${siteStructureItem.id}`
		);
	}
}

export const siteStructureItemsApiService = new SiteStructureItemsApiService();
