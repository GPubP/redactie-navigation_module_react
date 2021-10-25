import { ContentSchema } from '@redactie/content-module';
import { SiteDetailModel } from '@redactie/sites-module';

export const generateExternalUrl = (
	site: SiteDetailModel | undefined,
	contentItem: ContentSchema | undefined
): string => {
	return contentItem?.meta.urlPath?.nl?.value
		? `${site?.data.url.replace(/\/$/, '')}${contentItem?.meta.urlPath?.nl?.value}`
		: '';
};
