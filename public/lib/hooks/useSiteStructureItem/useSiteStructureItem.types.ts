import { LoadingState } from '@redactie/utils';

import { SiteStructureItem } from '../../services/siteStructureItems';

export type UseSiteStructureItem = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	removingState: LoadingState;
	siteStructureItem: SiteStructureItem | undefined;
};
