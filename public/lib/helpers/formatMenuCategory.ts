import { LangKeys } from '../navigation.const';

export const formatMenuCategory = (siteId: string, lang?: string): string => {
	return `menu_${siteId}_${lang || LangKeys.generic}`;
};
