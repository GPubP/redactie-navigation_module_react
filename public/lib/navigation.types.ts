export interface ListApiResponse<Embedded> {
	_embedded: Embedded;
	_page: ListApiPageResponse;
}

export interface ListApiPageResponse {
	number: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export interface CascaderOption {
	label: string;
	value: number;
	children: CascaderOption[];
}

export interface ContentCompartmentState {
	id: number;
	navigationTree: number;
	position?: number[];
	label?: string;
	slug?: string;
	description?: string;
	status?: string;
}
