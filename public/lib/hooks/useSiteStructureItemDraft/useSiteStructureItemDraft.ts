import { useObservable } from '@redactie/utils';

import { SiteStructureItem } from '../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

const useSiteStructureItemDraft = (): [SiteStructureItem | undefined] => {
	const siteStructureItemDraft = useObservable(siteStructureItemsFacade.siteStructureItemDraft$);

	return [siteStructureItemDraft];
};

export default useSiteStructureItemDraft;
