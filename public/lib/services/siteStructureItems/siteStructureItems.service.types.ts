import { EmbeddedNavItems, ListApiResponse, NavItem } from '../../navigation.types';

///////////////////////////////////////
// GET MENU ITEM TYPES ----------------
///////////////////////////////////////
export type SiteStructureItem = NavItem;
export type SiteStructureItemsResponse = ListApiResponse<EmbeddedNavItems>;
