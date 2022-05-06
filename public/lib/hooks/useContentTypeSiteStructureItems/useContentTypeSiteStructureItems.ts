import { LoadingState, useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { NavItem } from '../../navigation.types';
import { SiteStructureItem } from '../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

const useContentTypeSiteStructureItems = (
	key: string
): [LoadingState, SiteStructureItem[] | null | undefined] => {
	const isFetching$ = useMemo(() => siteStructureItemsFacade.selectItemIsFetching(key), [key]);
	const isFetching = useObservable(isFetching$, LoadingState.Loading);

	const contentTypeSiteStructureItems$ = useMemo(
		() => siteStructureItemsFacade.selectItemValue(key),
		[key]
	);
	const contentTypeSiteStructureItems = useObservable(contentTypeSiteStructureItems$, []);

	const error$ = useMemo(() => siteStructureItemsFacade.selectItemError(key), [key]);
	const error = useObservable(error$, null);

	const loadingState = error ? LoadingState.Error : isFetching;

	return [loadingState, contentTypeSiteStructureItems as NavItem[]];
};

export default useContentTypeSiteStructureItems;
