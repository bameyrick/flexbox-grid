const path = require('path');
const fs = require('fs');

const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const { NoEmitOnErrorsPlugin, NamedModulesPlugin } = require('webpack');
const { SplitChunksPlugin } = require('webpack').optimize;

const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const mqoptimize = require('postcss-mq-optimize');
const postcssUrl = require('postcss-url');
const SassModuleImporter = require('sass-module-importer');
const cssnano = require('cssnano');

const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];

const postcssPlugins = function() {
	// safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
	const minimizeOptions = {
		autoprefixer: false,
		safe: true,
		mergeLonghand: false,
		discardComments: {
			removeAll: true,
		},
	};

	return [
		postcssUrl({
			url: URL => {
				// Only convert root relative URLs, which CSS-Loader won't process into require().
				if (!URL.startsWith('/') || URL.startsWith('//')) {
					return URL;
				}
				if (deployUrl.match(/:\/\//)) {
					// If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
					return `${deployUrl.replace(/\/$/, '')}${URL}`;
				} else if (baseHref.match(/:\/\//)) {
					// If baseHref contains a scheme, include it as is.
					return baseHref.replace(/\/$/, '') + `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
				} else {
					// Join together base-href, deploy-url and the original URL.
					// Also dedupe multiple slashes into single ones.
					return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
				}
			},
		}),
		autoprefixer(),
		mqpacker({ sort: true }),
		mqoptimize(),
		cssnano(minimizeOptions),
	];
};

module.exports = {
	resolve: {
		extensions: ['.ts', '.js', '.scss', '.pug'],
		modules: ['./node_modules'],
		symlinks: true,
		alias: {},
	},

	resolveLoader: {
		modules: ['./node_modules'],
	},

	entry: {
		index: ['./src/scripts/index.ts'],
		styles: ['./src/styles/index.scss'],
	},

	output: {
		path: path.join(process.cwd(), 'docs'),
		filename: '[name].js',
		chunkFilename: '[id].js',
	},

	module: {
		rules: [
			{
				test: /\.pug$/,
				loaders: [
					'raw-loader',
					{
						loader: 'pug-html-loader',
						options: {
							doctype: 'html',
						},
					},
				],
			},
			{
				include: [path.join(process.cwd(), 'src/styles/index.scss')],
				test: /\.scss$|\.sass$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: postcssPlugins,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false,
							precision: 8,
							includePaths: [path.resolve('./src/styles')],
							importer: SassModuleImporter(),
						},
					},
				],
			},
			{
				test: /\.tsx?$/,
				exclude: /(node_modules)/,
				use: ['babel-loader', 'ts-loader'],
			},
		],
	},

	plugins: [
		new ProgressPlugin(),

		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].[contenthash].css',
		}),

		new SplitChunksPlugin({
			name: ['styles'],
			test: /\.css$/,
			chunks: 'all',
			enforce: true,
		}),

		new NoEmitOnErrorsPlugin(),

		new NamedModulesPlugin({}),

		new CircularDependencyPlugin({
			exclude: /(\\|\/)node_modules(\\|\/)/,
			failOnError: false,
		}),

		new SplitChunksPlugin({
			name: ['index'],
			minChunks: 2,
			async: 'common',
		}),

		new HtmlWebpackPlugin({
			filetype: 'pug',
			template: './src/views/index.pug',
			filename: './index.html',
			hash: false,
			inject: true,
			compile: true,
			favicon: false,
			minify: true,
			cache: true,
			showErrors: true,
			chunks: 'all',
			excludeChunks: [],
			excludeAssets: [/styles.*.js/],
			title: 'Flexbox Grid',
			xhtml: true,
			chunksSortMode: function sort(left, right) {
				let leftIndex = entryPoints.indexOf(left.names[0]);
				let rightIndex = entryPoints.indexOf(right.names[0]);

				if (leftIndex > rightIndex) {
					return 1;
				} else if (leftIndex < rightIndex) {
					return -1;
				} else {
					return 0;
				}
			},
		}),

		new HtmlWebpackExcludeAssetsPlugin(),
	],
};
