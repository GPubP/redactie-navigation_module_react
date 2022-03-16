import { isNil } from '@datorama/akita';
import { BaseEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { SiteStructuresState } from './siteStructures.model';
import { siteStructuresStore } from './siteStructures.store';

export class SiteStructuresQuery extends BaseEntityQuery<SiteStructuresState> {
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
	public siteStructures$ = this.selectAll();
	public siteStructure$ = this.select(state => state.siteStructure).pipe(
		filter(siteStructure => !isNil(siteStructure), distinctUntilChanged())
	);
	public siteStructureDraft$ = this.select(state => state.siteStructureDraft).pipe(
		filter(siteStructureDraft => !isNil(siteStructureDraft), distinctUntilChanged())
	);
}

export const siteStructuresQuery = new SiteStructuresQuery(siteStructuresStore);
