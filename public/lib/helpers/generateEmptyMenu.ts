import { NAV_STATUSES } from '../components';
import { LangKeys } from '../navigation.const';
import { CreateMenuDto } from '../services/menus';

export const generateEmptyMenu = (
	siteId: string,
	lang?: string
): CreateMenuDto & { lang: string } => ({
	label: '',
	description: '',
	publishStatus: NAV_STATUSES.DRAFT,
	category: `menu_${siteId}_${lang || LangKeys.generic}`,
	lang: lang || LangKeys.generic,
});
