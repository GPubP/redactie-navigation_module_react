import { BaseEntityState, Page } from '@redactie/utils';

import { SiteStructure } from '../../services/siteStructures';

export interface InternalState {
	readonly siteStructure: SiteStructure | null;
}

export type SiteStructureModel = SiteStructure;

export interface SiteStructuresState extends BaseEntityState<SiteStructureModel, string> {
	meta?: Page;
	siteStructure?: SiteStructureModel;
	siteStructureDraft?: SiteStructureModel;
}
