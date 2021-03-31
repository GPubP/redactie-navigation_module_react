import arrayTreeFilter from 'array-tree-filter';

import { CascaderOption } from '../../navigation.types';

export const getPositionInputValue = (options: CascaderOption[], inputValue: number[]): string => {
	return arrayTreeFilter(options, (o, level) => o.value === inputValue[level])
		.map(o => o.label)
		.join(' > ');
};

export const findPosition = (treeOptions: CascaderOption[], treeItemId?: number): number[] => {
	const reduceTreeOptions = (options: CascaderOption[]): number[] => {
		return options.reduce((acc, option) => {
			if (option.value == treeItemId) {
				acc.push(option.value);
				return acc;
			}

			if (option.children && option.children.length > 0) {
				const childrenValue = reduceTreeOptions(option.children);

				if (childrenValue && childrenValue.length > 0) {
					return [option.value, ...childrenValue];
				}
			}

			return acc;
		}, [] as number[]);
	};

	return reduceTreeOptions(treeOptions);
};
