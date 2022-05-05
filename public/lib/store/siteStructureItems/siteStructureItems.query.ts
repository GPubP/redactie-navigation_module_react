import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { NavItem } from '../../navigation.types';

import { SiteStructureItemsState } from './siteStructureItems.model';
import { siteStructureItemsStore } from './siteStructureItems.store';

export class SiteStructureItemsQuery extends BaseEntityQuery<SiteStructureItemsState> {
	public siteStructureItems$ = this.selectAll();
	public siteStructureItem$ = this.select(state => state.siteStructureItem).pipe(
		filter(siteStructureItem => !isNil(siteStructureItem), distinctUntilChanged())
	);
	public siteStructureItemDraft$ = this.select(state => state.siteStructureItemDraft).pipe(
		filter(siteStructureItemDraft => !isNil(siteStructureItemDraft), distinctUntilChanged())
	);
	public pendingSiteStructureItem$ = this.select(state => state.pendingSiteStructureItem).pipe(
		filter(pendingSiteStructureItem => !isNil(pendingSiteStructureItem), distinctUntilChanged())
	);
	public contentTypeSiteStructureItems$ = this.select(
		state => state.contentTypeSiteStructureItems
	);
	public pendingSiteStructureItemSync = (): NavItem | undefined =>
		this.getValue()?.pendingSiteStructureItem;
}

export const siteStructureItemsQuery = new SiteStructureItemsQuery(siteStructureItemsStore);
