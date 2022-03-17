const typescriptTransform = require('i18next-scanner-typescript');

module.exports = {
	input: [
		'public/**/*.{ts,tsx}',
		// Use ! to filter out files or directories
		'!public/**/*.spec.{ts,tsx)',
		'!public/assets/**',
		'!**/node_modules/**',
	],
	output: './public/assets/',
	options: {
		func: {
			list: ['tKey'],
			extensions: ['.ts', '.tsx'],
		},
		lngs: ['nl-BE'],
		ns: ['navigation'],
		defaultLng: 'nl-BE',
		defaultNs: 'navigation',
		defaultValue: '__STRING_NOT_TRANSLATED__',
		resource: {
			loadPath: 'public/assets/i18n/template.json',
			savePath: 'i18n/locales/template.json',
			jsonIndent: 2,
			lineEnding: '\n',
		},
		transform: typescriptTransform({ extensions: ['.tsx', '.ts'] }),
	},
};
