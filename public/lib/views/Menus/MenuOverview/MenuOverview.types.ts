export interface OverviewTableRow {
	label: string | null | undefined;
	description: string | null | undefined;
	lang: string;
	navigate: (id: string) => void;
	id: string;
}
