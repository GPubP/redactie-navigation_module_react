import { useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

const useSiteStructureDraft = (key: string): [SiteStructure | undefined] => {
	const siteStructureDraft$ = useMemo(
		() => siteStructuresFacade.selectItemValue(`${key}.draft`),
		[key]
	);
	const siteStructureDraft = useObservable(siteStructureDraft$) as SiteStructure;

	return [siteStructureDraft];
};

export default useSiteStructureDraft;
