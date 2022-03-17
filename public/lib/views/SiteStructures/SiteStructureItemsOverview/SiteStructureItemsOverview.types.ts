export interface SiteStructureItemsTableRow {
	id: number;
	label: string;
	url: string;
	active: boolean;
	hasChildren: boolean;
	rows: SiteStructureItemsTableRow[];
	navigate: (siteStructureItemId: number) => void;
}
