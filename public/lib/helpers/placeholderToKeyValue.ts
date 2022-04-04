import { PatternRowData } from '../components/ContentTypeDetailMenu/ContentTypeDetailMenu.types';

function placeholderToKeyValue(
	placeholders: PatternRowData[]
): { [key: string]: { [sub: string]: string } } {
	return placeholders.reduce(
		(
			acc: { [key: string]: { [sub: string]: string } },
			{ key: placeholder, example: value }
		) => {
			const valueWithoutBrackets = placeholder.replace(/\[|\]/g, '');
			const parent = valueWithoutBrackets?.split(':')[0] ?? '';
			const key = valueWithoutBrackets?.split(':')[1];

			if (key) {
				acc[parent] = { ...acc[parent], [key]: value };
			}

			return acc;
		},
		{}
	);
}

export { placeholderToKeyValue };
