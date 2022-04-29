export interface MenuItemRowData {
	id: string;
	label: string;
	menu: string;
	menuId: string;
	position: string;
	newItem: boolean;
	editMenuItem: (id: string, menuId: string) => void;
}
