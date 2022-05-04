import { LoadingState, useObservable } from '@redactie/utils';

import { SiteStructureItem } from '../../services/siteStructureItems';
import { siteStructureItemsFacade } from '../../store/siteStructureItems';

const useContentTypeSiteStructureItems = (): [
	LoadingState,
	SiteStructureItem[] | null | undefined
] => {
	const loading = useObservable(siteStructureItemsFacade.isFetching$, LoadingState.Loading);
	const contentTypeSiteStructureItems = useObservable(
		siteStructureItemsFacade.contentTypeSiteStructureItems$,
		[]
	);
	const error = useObservable(siteStructureItemsFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, contentTypeSiteStructureItems];
};

export default useContentTypeSiteStructureItems;
