import { ContentSchema } from '@redactie/content-module';
import { SiteDetailModel } from '@redactie/sites-module';

import { getLangSiteUrl } from './getSiteUrl';

export const generateExternalUrl = (
	site: SiteDetailModel | undefined,
	contentItem: ContentSchema | undefined
): string => {
	return contentItem?.meta.urlPath?.[contentItem?.meta.lang]?.value
		? `${getLangSiteUrl(site, contentItem?.meta.lang)?.replace(/\/$/, '')}${
				contentItem?.meta.urlPath?.[contentItem?.meta.lang]?.value
		  }`
		: '';
};
