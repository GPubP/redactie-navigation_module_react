export interface MenuItemsTableRow {
	id: string;
	label: string;
	url: string;
	status: string;
	rows: MenuItemsTableRow[];
	navigate: (menuItemUuid: string) => void;
}
