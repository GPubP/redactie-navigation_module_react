const path = require('path');

const RedactionWebpackPlugin = require('@redactie/module-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packageJSON = require('./package.json');

module.exports = env => {
	const defaultConfig = {
		mode: 'production',
		devtool: 'source-map',
		entry: './public/index.tsx',
		performance: {
			hints: false,
		},
		module: {
			rules: [
				{
					test: /\.ts(x)?$/,
					use: 'ts-loader',
					include: [/public/],
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
								importLoaders: 1,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: () => [postcssPresetEnv()],
							},
						},
						'sass-loader',
					],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		plugins: [
			// add default plugins here
		],
		externals: {
			react: 'react',
			ramda: 'ramda',
			ky: 'ky',
			formik: 'formik',
			yup: 'yup',
			rxjs: 'rxjs',
			'rxjs/operators': 'rxjs/operators',
			'react-dom': 'react-dom',
			'react-router-dom': 'react-router-dom',
			'@redactie/redactie-core': '@redactie/redactie-core',
			'@redactie/content-module': '@redactie/content-module',
			'@redactie/translations-module': '@redactie/translations-module',
			'@redactie/utils': '@redactie/utils',
			'@acpaas-ui/react-components': '@acpaas-ui/react-components',
			'@acpaas-ui/react-editorial-components': '@acpaas-ui/react-editorial-components',
			'@datorama/akita': '@datorama/akita',
		},
		output: {
			filename: 'redactie-navigation-module.umd.js',
			path: path.resolve(__dirname, 'dist'),
			libraryTarget: 'umd',
		},
	};

	if (env.analyse) {
		return {
			...defaultConfig,
			plugins: [...defaultConfig.plugins, new BundleAnalyzerPlugin()],
		};
	}

	if (env.prod) {
		return {
			...defaultConfig,
			plugins: [
				...defaultConfig.plugins,
				new RedactionWebpackPlugin({
					moduleName: packageJSON.name,
				}),
			],
		};
	}

	return defaultConfig;
};
