import { ContentTypeSchema } from '@redactie/content-module';
import { Links, Page } from '@redactie/utils';

import {
	CreateNavTreeDto,
	EmbeddedNavTree,
	ListApiResponse,
	NavTree,
	UpdateNavTreeDto,
} from '../../navigation.types';

/////////////////////////////////
// GET MENUS TYPES ---------------------
/////////////////////////////////
export type MenusResponse = ListApiResponse<EmbeddedNavTree>;
export type CreateMenuDto = CreateNavTreeDto;
export type UpdateMenuDto = UpdateNavTreeDto;
export interface Menu extends Omit<NavTree, 'category'> {
	category: string;
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
