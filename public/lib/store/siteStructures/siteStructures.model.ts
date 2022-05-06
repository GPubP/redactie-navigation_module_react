import { BaseMultiEntityState, Page } from '@redactie/utils';

import { SiteStructure } from '../../services/siteStructures';

export interface InternalState {
	readonly siteStructure: SiteStructure | null;
}

export type SiteStructureModel = SiteStructure;

export interface SiteStructuresState
	extends BaseMultiEntityState<SiteStructureModel[] | SiteStructureModel | undefined, string> {
	meta?: Page;
}
