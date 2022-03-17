import { NAV_STATUSES } from '../components';
import { CreateMenuDTO } from '../services/menus';

export const generateEmptyMenu = (
	siteName: string | undefined
): CreateMenuDTO & { lang: string } => ({
	label: '',
	description: '',
	publishStatus: NAV_STATUSES.DRAFT,
	category: `menu_${siteName}_nl`,
	// TODO: Implement language
	lang: 'nl',
});
