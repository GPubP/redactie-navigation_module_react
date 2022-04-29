import { SiteDetailModel } from '@redactie/sites-module';

export const getLangSiteUrl = (site: SiteDetailModel | undefined, language = ''): string =>
	(site?.data.url as any)?.multilanguage || (site?.data.url as any)?.multiLanguage
		? ((site?.data.url as any) || {})[language] || ''
		: site?.data.url || '';
