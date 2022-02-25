import { ListApiResponse } from '../../navigation.types';

///////////////////////////////////////
// GET MENU ITEM TYPES ----------------
///////////////////////////////////////
export interface MenuDetailItem {
	id?: number;
	label?: string;
	description?: string;
	publishStatus?: string;
	slug?: string;
	externalUrl?: string;
	items?: MenuDetailItem[];
}

export type MenuItemsResponse = ListApiResponse<EmbeddedMenuItems>;

export interface EmbeddedMenuItems {
	resourceList: MenuItem[];
}

export interface MenuItem extends MenuDetailItem {
	parentId?: string;
	lang?: string;
}
