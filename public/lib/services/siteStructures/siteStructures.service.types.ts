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
export type CreateSiteStructureDto = CreateNavTreeDTO;
export type UpdateSiteStructureDto = UpdateNavTreeDTO;
export type SiteStructure = NavTree;
