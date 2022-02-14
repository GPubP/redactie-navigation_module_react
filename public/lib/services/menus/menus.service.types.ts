import { EmbeddedResponse } from '@redactie/utils';
import { ListApiResponse } from '../../navigation.types';

/**
 * Menus
 */

 export interface MenuQuery {}

export interface MenuMeta {
	label?: string;
	safeLabel?: string;
	description?: string;
	lang?: string;
	created?: string;
	lastModified?: string;
	lastEditor?: null;
	deleted?: boolean;
	site?: string;
}

export interface MenuSchema {
	query?: MenuQuery;
	meta: MenuMeta;
	uuid?: string;
}

export type MenusSchema = EmbeddedResponse<MenuSchema>;

/////////////////////////////////
// GET MENUS TYPES ---------------------
/////////////////////////////////
export type MenusResponse = ListApiResponse<Embedded>;

export interface Embedded {
	resourceList: Menu[];
}

export interface Menu {
	id: number;
	logicalId: string;
	label: string;
	description: string;
	category: MenuCategory;
	publishStatus: string;
	createdBy: string;
	createdAt: Date;
	updatedBy: string;
	updatedAt: Date;
	slug: string;
	meta: MenuMeta;
}

export interface MenuCategory {
	id: number;
	label: string;
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
