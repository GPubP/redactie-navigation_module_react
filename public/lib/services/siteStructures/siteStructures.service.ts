import { SearchParams } from '@redactie/utils';

import { api } from '../api';

import {
	SiteStructure,
	SiteStructuresResponse,
	UpdateSiteStructureDTO,
} from './siteStructures.service.types';

export class SiteStructuresApiService {
	public async getSiteStructures(
		siteId: string,
		searchParams: SearchParams
	): Promise<SiteStructuresResponse> {
		return api
			.get(`${siteId}/site-structures`, {
				searchParams,
			})
			.json();
	}

	public async getSiteStructure(siteId: string, id: string): Promise<SiteStructure> {
		return api.get(`${siteId}/site-structures/${id}`).json();
	}

	public async createSiteStructure(
		siteId: string,
		siteStructure: SiteStructure
	): Promise<SiteStructure> {
		return api
			.post(`${siteId}/site-structures`, {
				json: siteStructure,
			})
			.json();
	}

	public async updateSiteStructure(
		siteId: string,
		siteStructure: UpdateSiteStructureDTO
	): Promise<SiteStructure> {
		return api
			.put(`${siteId}/site-structures/${siteStructure.id}`, {
				json: siteStructure,
			})
			.json();
	}

	public async deleteSiteStructure(siteId: string, menu: SiteStructure): Promise<Response> {
		return api.delete(`${siteId}/site-structure/${menu.id}`);
	}
}

export const siteStructuresApiService = new SiteStructuresApiService();
