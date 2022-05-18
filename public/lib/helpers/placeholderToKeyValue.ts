import { lensPath, set } from 'ramda';

import { PatternRowData } from '../components/ContentTypeDetailMenu/ContentTypeDetailMenu.types';

function placeholderToKeyValue(
	placeholders: PatternRowData[]
): { [key: string]: { [sub: string]: string } } {
	return placeholders.reduce(
		(acc: { [key: string]: { [sub: string]: string } }, { key, example: value }) => {
			return set(lensPath(key.replace(/\[|\]/g, '').split(':')), value)(acc);
		},
		{}
	);
}

export { placeholderToKeyValue };
