import { FilterItem } from '@redactie/utils';

export interface FilterFormProps {
	activeFilters: FilterItem[];
	initialState: FilterFormState;
	clearActiveFilter: (item: FilterItem) => void;
	onSubmit: (values: FilterFormState) => void;
	onCancel: () => void;
}

export interface FilterFormState {
	label: string;
}
