import { BaseEntityState } from '@redactie/utils';

import { SiteStructureItem } from '../../services/siteStructureItems';

export interface InternalState {
	readonly siteStructureItem: SiteStructureItem | null;
}

export type SiteStructureItemModel = SiteStructureItem;

export interface SiteStructureItemsState extends BaseEntityState<SiteStructureItemModel, string> {
	siteStructureItem?: SiteStructureItemModel;
	siteStructureItemDraft?: SiteStructureItemModel;
}
