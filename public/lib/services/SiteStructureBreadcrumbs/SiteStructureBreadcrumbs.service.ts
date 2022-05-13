import { EmbeddedNavItems, ListApiResponse } from '../../navigation.types';
import { api } from '../api';

export class SitestructureBreadcrumbsApiService {
	public getBreadcrumbsOfContentItem(
		siteId: string,
		uuid: string
	): Promise<ListApiResponse<EmbeddedNavItems>> {
		return api.get(`${siteId}/content/${uuid}/breadcrumbs`).json();
	}
}

export const sitestructureBreadcrumbsApiService = new SitestructureBreadcrumbsApiService();
