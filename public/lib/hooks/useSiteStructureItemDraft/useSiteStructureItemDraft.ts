import { useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { SiteStructureItem } from '../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

const useSiteStructureItemDraft = (key: string): [SiteStructureItem | undefined] => {
	const siteStructureItemDraft$ = useMemo(
		() => siteStructureItemsFacade.selectItemValue(`${key}.draft`),
		[key]
	);
	const siteStructureItemDraft = useObservable(siteStructureItemDraft$) as SiteStructureItem;

	return [siteStructureItemDraft];
};

export default useSiteStructureItemDraft;
