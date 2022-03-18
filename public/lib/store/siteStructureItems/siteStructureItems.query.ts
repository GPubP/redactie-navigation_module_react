import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { equals } from 'ramda';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { SiteStructureItemsState } from './siteStructureItems.model';
import { siteStructureItemsStore } from './siteStructureItems.store';

export class SiteStructureItemsQuery extends BaseEntityQuery<SiteStructureItemsState> {
	public siteStructureItems$ = this.selectAll();
	public siteStructureItem$ = this.select(state => state.siteStructureItem).pipe(
		filter(siteStructureItem => !isNil(siteStructureItem), distinctUntilChanged())
	);
	public siteStructureItemDraft$ = this.select(state => state.siteStructureItemDraft).pipe(
		filter(
			siteStructureItemDraft => !isNil(siteStructureItemDraft),
			// TODO: Figure out why this is needed to not trigger the leave prompt on sitestructure item create/update
			distinctUntilChanged((a, b) => equals(a, b))
		)
	);
}

export const siteStructureItemsQuery = new SiteStructureItemsQuery(siteStructureItemsStore);
