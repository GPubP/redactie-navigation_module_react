import { useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { NavItem } from '../../navigation.types';
import { siteStructureItemsFacade } from '../../store/siteStructureItems/siteStructureItems.facade';

import { UsePendingSiteStructure } from './usePendingSiteStructureItem.type';

const usePendingSiteStructureItem = (key: string): UsePendingSiteStructure => {
	const pendingSiteStructureItem$ = useMemo(
		() => siteStructureItemsFacade.selectItemValue(`${key}.pending`),
		[key]
	);
	const pendingSiteStructureItem = useObservable(pendingSiteStructureItem$) as NavItem;

	return [pendingSiteStructureItem];
};

export default usePendingSiteStructureItem;
