const { getModuleConfig } = require('@redactie/utils/dist/webpack');

const packageJSON = require('./package.json');

module.exports = env => {
	const defaultConfig = getModuleConfig({
		packageJSON,
		styleIncludes: [/public/, /node_modules\/@a-ui\/core/],
		sassIncludes: [/public/, /node_modules\/@a-ui\/core/],
		externals: {
			'@redactie/roles-rights-module': '@redactie/roles-rights-module',
			'@redactie/translations-module': '@redactie/translations-module',
			'@redactie/content-module': '@redactie/content-module',
			'@redactie/content-types-module': '@redactie/content-module',
			'@redactie/language-module': '@redactie/language-module',
		},
	})(env);

	return [defaultConfig];
};
