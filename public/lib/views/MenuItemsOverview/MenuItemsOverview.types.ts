import { MenuItem } from '../../services/menuItems';

export interface MenuItemsTableRow {
	id: number;
	label: string;
	url: string;
	active: boolean;
	parents: MenuItem[];
	childItemCount: number;
	rows: MenuItemsTableRow[];
	navigate: (menuItemId: number) => void;
}
