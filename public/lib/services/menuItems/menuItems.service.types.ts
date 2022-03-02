import { ListApiResponse } from '../../navigation.types';

///////////////////////////////////////
// GET MENU ITEM TYPES ----------------
///////////////////////////////////////
export interface MenuItem {
	id?: number;
	label: string;
	description: string;
	publishStatus: string;
	slug: string;
	externalUrl: string;
	logicalId: string;
	parentId?: number;
	weight?: number;
	items: MenuItem[];
}

export type MenuItemsResponse = ListApiResponse<EmbeddedMenuItems>;

export interface EmbeddedMenuItems {
	resourceList: MenuItem[];
}
