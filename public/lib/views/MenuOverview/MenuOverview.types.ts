export interface OverviewTableRow {
	label: string | null | undefined ;
	description: string | null | undefined ;
	quantity: number;
	lang: string;
	navigate: (id: string) => void;
	id: string;
}
