import { useObservable } from '@redactie/utils';

import { siteStructureItemsFacade } from '../../store/siteStructureItems/siteStructureItems.facade';

import { UsePendingSiteStructure } from './usePendingSiteStructure.type';

const usePendingSiteStructure = (): UsePendingSiteStructure => {
	const pendingSiteStructureItem = useObservable(
		siteStructureItemsFacade.pendingSiteStructureItem$,
		undefined
	);

	return [pendingSiteStructureItem];
};

export default usePendingSiteStructure;
