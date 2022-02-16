export interface OverviewTableRow {
	label: string | null | undefined ;
	description: string | null | undefined ;
	quantity: number;
	lang: string;
	settingsPath: string;
	navigate: (menuId: string) => void;
}
