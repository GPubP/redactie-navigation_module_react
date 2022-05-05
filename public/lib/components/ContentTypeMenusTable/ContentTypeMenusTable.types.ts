import { Language } from '@redactie/utils';
import { ContentTypeSiteDetailTabFormState } from '../ContentTypeSiteDetailTab/ContentTypeSiteDetailTab.types';

export interface ContentTypeMenusTableProps {
	name: string;
	activeLanguage: Language;
	siteId: string;
	value: ContentTypeSiteDetailTabFormState;
}

export interface MenusRowData {
	id: string;
	menu: string;
	active: boolean;
	description: string;
	activateMenu: (id: string) => void;
	deactivateMenu: (id: string) => void;
}
