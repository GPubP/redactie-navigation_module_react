import { LoadingState, Page, useObservable } from '@redactie/utils';

import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

const useSiteStructures = (): [
	LoadingState,
	SiteStructure[] | null | undefined,
	Page | null | undefined
] => {
	const loading = useObservable(siteStructuresFacade.isFetching$, LoadingState.Loading);
	const siteStructures = useObservable(siteStructuresFacade.siteStructures$, []);
	const sitesStructuresPaging = useObservable(siteStructuresFacade.meta$, null);
	const error = useObservable(siteStructuresFacade.error$, null);

	const loadingState = error ? LoadingState.Error : loading;

	return [loadingState, siteStructures, sitesStructuresPaging];
};

export default useSiteStructures;
