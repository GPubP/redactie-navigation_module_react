import arrayTreeFilter from 'array-tree-filter';

import { CascaderOption } from '../navigation.types';

export const getPositionInputValue = (options: CascaderOption[], inputValue: number[]): string => {
	return arrayTreeFilter(options, (o, level) => o.value === inputValue[level])
		.map(o => o.label)
		.join(' > ');
};
