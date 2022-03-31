import { LangKeys } from '../navigation.const';

export const formatSiteStructureCategory = (siteId: string, lang?: string): string => {
	return `siteStructure_${siteId}_${lang || LangKeys.generic}`;
};
