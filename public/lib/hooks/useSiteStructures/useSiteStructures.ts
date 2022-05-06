import { LoadingState, Page, useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { SiteStructure } from '../../services/siteStructures';
import { siteStructuresFacade } from '../../store/siteStructures';

const useSiteStructures = (
	key: string
): [LoadingState, SiteStructure[] | null | undefined, Page | null | undefined] => {
	const isFetching$ = useMemo(() => siteStructuresFacade.selectItemIsFetching(key), [key]);
	const isFetching = useObservable(isFetching$, LoadingState.Loaded);

	const siteStructures$ = useMemo(() => siteStructuresFacade.selectItemValue(key), [key]);
	const siteStructures = useObservable(siteStructures$, undefined);

	const error$ = useMemo(() => siteStructuresFacade.selectItemError(key), [key]);
	const error = useObservable(error$, null);

	const sitesStructuresPaging = useObservable(siteStructuresFacade.meta$, null);

	const loadingState = error ? LoadingState.Error : isFetching;

	return [loadingState, siteStructures as SiteStructure[], sitesStructuresPaging];
};

export default useSiteStructures;
