import { BaseEntityState } from '@redactie/utils';

import { NavItem } from '../../navigation.types';
import { SiteStructureItem } from '../../services/siteStructureItems';

export interface InternalState {
	readonly siteStructureItem: SiteStructureItem | null;
}

export type SiteStructureItemModel = SiteStructureItem;

export interface SiteStructureItemsState extends BaseEntityState<SiteStructureItemModel, string> {
	siteStructureItem?: SiteStructureItemModel;
	siteStructureItemDraft?: SiteStructureItemModel;
	pendingSiteStructureItem?: NavItem;
}
