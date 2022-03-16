import { ContentTypeSchema } from '@redactie/content-module';
import { Links, Page } from '@redactie/utils';

import {
	CreateNavTreeDTO,
	EmbeddedNavTree,
	ListApiResponse,
	NavTree,
	UpdateNavTreeDTO,
} from '../../navigation.types';

/////////////////////////////////
// GET MENUS TYPES ---------------------
/////////////////////////////////
export type MenusResponse = ListApiResponse<EmbeddedNavTree>;
export type CreateMenuDTO = CreateNavTreeDTO;
export type UpdateMenuDTO = UpdateNavTreeDTO;
export type Menu = NavTree;

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
