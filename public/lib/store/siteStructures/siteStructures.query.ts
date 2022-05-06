import { isNil } from '@datorama/akita';
import { BaseMultiEntityQuery } from '@redactie/utils';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { SiteStructuresState } from './siteStructures.model';
import { siteStructuresStore } from './siteStructures.store';

export class SiteStructuresQuery extends BaseMultiEntityQuery<SiteStructuresState> {
	public meta$ = this.select(state => state.meta).pipe(
		filter(meta => !isNil(meta), distinctUntilChanged())
	);
}

export const siteStructuresQuery = new SiteStructuresQuery(siteStructuresStore);
