import { Language } from '@redactie/utils';

export interface MenusCheckboxListProps {
	name: string;
	activeLanguage: Language;
	siteId: string;
}

export interface MenusRowData {
	id: string;
	menu: string;
	active: boolean;
	description: string;
	activateMenu: (id: string) => void;
	deactivateMenu: (id: string) => void;
}
