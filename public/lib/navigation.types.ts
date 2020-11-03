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
	value: string;
	children: CascaderOption[];
}

export interface ContentCompartmentState {
	id: string;
	navigationTree: string;
}
