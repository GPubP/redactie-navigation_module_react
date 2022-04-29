import { NavItemType } from '../../../navigation.types';

export interface MenuItemsTableRow {
	id: number;
	label: string;
	url: string;
	siteUrl: string;
	type: NavItemType;
	active: boolean;
	hasChildren: boolean;
	rows: MenuItemsTableRow[];
	navigate: (menuItemId: number) => void;
}
