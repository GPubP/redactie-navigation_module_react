import { EmbeddedNavItems, ListApiResponse, NavItem } from '../../navigation.types';

///////////////////////////////////////
// GET MENU ITEM TYPES ----------------
///////////////////////////////////////
export type MenuItem = NavItem;
export type MenuItemsResponse = ListApiResponse<EmbeddedNavItems>;
