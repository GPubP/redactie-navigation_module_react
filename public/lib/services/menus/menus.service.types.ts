import { ContentTypeSchema } from '@redactie/content-module';
import { Links, Page } from '@redactie/utils';

import { ListApiResponse } from '../../navigation.types';

/////////////////////////////////
// GET MENUS TYPES ---------------------
/////////////////////////////////
export type MenusResponse = ListApiResponse<EmbeddedMenu>;

export interface EmbeddedMenu {
	resourceList: Menu[];
}

export interface Menu {
	id?: number;
	logicalId?: string;
	label?: string;
	description?: string;
	lang?: string;
	category?: string;
	publishStatus?: string;
	createdBy?: string;
	createdAt?: Date;
	updatedBy?: string;
	updatedAt?: Date;
	slug?: string;
	meta?: MenuMeta;
	itemCount?: number;
	items?: MenuDetailItem[];
}

export interface MenuCategory {
	id: number;
	label: string;
}

export interface MenuMeta {
	lastEditor: null;
}
///////////////////////////////////////
// GET MENU TYPES ---------------------
///////////////////////////////////////
export interface MenuDetail extends Menu {
	items: MenuDetailItem[];
}

export interface MenuDetailItem {
	id: number;
	label: string;
	description: string;
	publishStatus: string;
	slug: string;
	externalUrl?: string;
	items: MenuDetailItem[];
}

///////////////////////////////////////
// GET MENU ITEM TYPES ----------------
///////////////////////////////////////
export type MenuItemsResponse = ListApiResponse<EmbeddedMenuItems>;

export interface EmbeddedMenuItems {
	resourceList: MenuItem[];
}

export interface MenuItem extends Omit<MenuDetailItem, 'items'> {
	parentId?: number;
}

///////////////////////////////////////
// CREATE MENU ITEM TYPES -------------
///////////////////////////////////////

export type CreateMenuItemPayload = Omit<MenuItem, 'id'>;

///////////////////////////////////////
// UPDATE MENU ITEM TYPES -------------
///////////////////////////////////////

export type UpdateMenuItemPayload = CreateMenuItemPayload;

///////////////////////////////////////
// GET MENU OCCURRENCES ---------------------
///////////////////////////////////////
export interface OccurrencesResponse {
	_links: Links;
	_embedded: {
		contentTypes: ContentTypeSchema[];
	};
	_page: Page;
}
