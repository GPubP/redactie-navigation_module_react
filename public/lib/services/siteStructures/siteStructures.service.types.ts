import {
	CreateNavTreeDto,
	EmbeddedNavTree,
	ListApiResponse,
	NavTree,
	UpdateNavTreeDto,
} from '../../navigation.types';

/////////////////////////////////
// GET SITE STRUCTURES TYPES ---------------------
/////////////////////////////////
export type SiteStructuresResponse = ListApiResponse<EmbeddedNavTree>;
export type CreateSiteStructureDto = CreateNavTreeDto;
export type UpdateSiteStructureDto = UpdateNavTreeDto;
export interface SiteStructure extends Omit<NavTree, 'category'> {
	category: string;
}
