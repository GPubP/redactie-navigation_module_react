import { BaseMultiEntityState } from '@redactie/utils';

import { SiteStructureItem } from '../../services/siteStructureItems';

export interface InternalState {
	readonly siteStructureItem: SiteStructureItem | null;
}

export type SiteStructureItemModel = SiteStructureItem;

export type SiteStructureItemsState = BaseMultiEntityState<
	SiteStructureItemModel[] | SiteStructureItemModel | undefined,
	string
>;
