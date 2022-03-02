import { ContentTypeSchema } from '@redactie/content-module';
import { Links, Page } from '@redactie/utils';

import { ListApiResponse } from '../../navigation.types';
import { MenuItem } from '../menuItems';

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
	label: string;
	description: string;
	lang: string;
	category: string;
	publishStatus: string;
	createdBy?: string;
	createdAt?: Date;
	updatedBy?: string;
	updatedAt?: Date;
	slug: string;
	meta?: MenuMeta;
	itemCount?: number;
	items: MenuItem[];
}

export interface MenuCategory {
	id: number;
	label: string;
}

export interface MenuMeta {
	lastEditor: null;
}

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
