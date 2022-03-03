export interface MenuItemsTableRow {
	id: number;
	label: string;
	url: string;
	active: boolean;
	hasChildren: boolean;
	rows: MenuItemsTableRow[];
	navigate: (menuItemId: number) => void;
}
