import { CascaderOption } from '../navigation.types';

export const findPosition = (treeOptions: CascaderOption[], treeItemId?: number): number[] => {
	const reduceTreeOptions = (options: CascaderOption[]): number[] => {
		return options.reduce((acc, option) => {
			if (option.value === treeItemId) {
				return [...acc, option.value];
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
