import { NAV_STATUSES } from '../components';
import { CreateSiteStructureDTO } from '../services/siteStructures';

export const generateEmptySiteStructure = (
	siteName: string | undefined
): CreateSiteStructureDTO => ({
	label: '',
	description: '',
	publishStatus: NAV_STATUSES.DRAFT,
	category: `siteStructure_${siteName}_nl`,
});
