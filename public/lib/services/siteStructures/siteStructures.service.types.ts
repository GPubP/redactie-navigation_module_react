import {
	CreateNavTreeDTO,
	EmbeddedNavTree,
	ListApiResponse,
	NavTree,
	UpdateNavTreeDTO,
} from '../../navigation.types';

/////////////////////////////////
// GET SITE STRUCTURES TYPES ---------------------
/////////////////////////////////
export type SiteStructuresResponse = ListApiResponse<EmbeddedNavTree>;
export type CreateSiteStructureDTO = CreateNavTreeDTO;
export type UpdateSiteStructureDTO = UpdateNavTreeDTO;
export type SiteStructure = NavTree;
