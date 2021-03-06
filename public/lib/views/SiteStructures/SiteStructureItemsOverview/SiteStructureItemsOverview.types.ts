import { NavItemType } from '../../../navigation.types';

export interface SiteStructureItemsTableRow {
	id: number;
	label: string;
	url: string;
	siteUrl: string;
	slug: string;
	externalReference?: string;
	type: NavItemType;
	active: boolean;
	hasChildren: boolean;
	rows: SiteStructureItemsTableRow[];
	navigate: (siteStructureItemId: number) => void;
}
