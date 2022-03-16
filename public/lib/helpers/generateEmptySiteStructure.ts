import { NAV_STATUSES } from '../components';
import { CreateSiteStructureDto } from '../services/siteStructures';

export const generateEmptySiteStructure = (
	siteName: string | undefined
): CreateSiteStructureDto => ({
	label: '',
	description: '',
	publishStatus: NAV_STATUSES.DRAFT,
	category: `siteStructure_${siteName}_nl`,
});
