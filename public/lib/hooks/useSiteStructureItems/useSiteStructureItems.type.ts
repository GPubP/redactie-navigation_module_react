import { LoadingState } from '@redactie/utils';

import { SiteStructureItem } from '../../services/siteStructureItems';

export type UseSiteStructureItems = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	removingState: LoadingState;
	siteStructureItems: SiteStructureItem[] | undefined;
};
