import { useObservable } from '@redactie/utils';

import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

const useSiteStructureDraft = (): [SiteStructure | undefined] => {
	const siteStructureDraft = useObservable(siteStructuresFacade.siteStructureDraft$);

	return [siteStructureDraft];
};

export default useSiteStructureDraft;
