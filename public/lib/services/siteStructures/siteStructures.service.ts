import { SearchParams } from '@redactie/utils';

import { NavTree } from '../../navigation.types';
import { api } from '../api';

import {
	SiteStructure,
	SiteStructuresResponse,
	UpdateSiteStructureDto,
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

	public async getSiteStructure(siteId: string, id: string): Promise<NavTree> {
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
		siteStructure: UpdateSiteStructureDto
	): Promise<NavTree> {
		return api
			.put(`${siteId}/site-structures/${siteStructure.id}`, {
				json: siteStructure,
			})
			.json();
	}

	public async deleteSiteStructure(siteId: string, menu: SiteStructure): Promise<Response> {
		return api.delete(`${siteId}/site-structures/${menu.id}`);
	}
}

export const siteStructuresApiService = new SiteStructuresApiService();
