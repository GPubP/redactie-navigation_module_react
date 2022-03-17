import { LoadingState } from '@redactie/utils';

import { SiteStructure } from '../../services/siteStructures';

export type UseSiteStructure = {
	fetchingState: LoadingState;
	upsertingState: LoadingState;
	removingState: LoadingState;
	siteStructure: SiteStructure | undefined;
};
