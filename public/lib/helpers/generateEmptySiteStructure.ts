import { NAV_STATUSES } from '../components';
import { CreateSiteStructureDto } from '../services/siteStructures';

export const generateEmptySiteStructure = (
	siteName: string | undefined
): CreateSiteStructureDto & { lang: string } => ({
	label: '',
	description: '',
	publishStatus: NAV_STATUSES.DRAFT,
	category: `siteStructure_${siteName}_nl`,
	// TODO: Implement language
	lang: 'nl',
});
