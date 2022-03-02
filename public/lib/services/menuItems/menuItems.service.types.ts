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
	items: MenuItem[];
	parentId?: number;
	weight?: number;
	parents?: MenuItem[];
	childItemCount?: number;
}

export type MenuItemsResponse = ListApiResponse<EmbeddedMenuItems>;

export interface EmbeddedMenuItems {
	resourceList: MenuItem[];
}
