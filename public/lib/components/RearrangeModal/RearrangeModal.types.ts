export enum MoveDirection {
	Up,
	Down,
}

export interface RearrangeTableRow {
	canMoveDown: boolean;
	canMoveUp: boolean;
	url: string;
	id: number;
	label: string;
	weight: number;
}
