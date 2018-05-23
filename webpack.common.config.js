const path = require('path');
const fs = require('fs');

const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { SplitChunksPlugin } = require('webpack').optimize;

const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const mqoptimize = require('postcss-mq-optimize');
const postcssUrl = require('postcss-url');
const SassModuleImporter = require('sass-module-importer');
const cssnano = require('cssnano');

const devMode = process.env.NODE_ENV !== 'production';

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
		path: path.join(process.cwd(), 'dist'),
		filename: '[name].bundle.js',
		chunkFilename: '[id].chunk.js',
	},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader',
				exclude: [/(\\|\/)node_modules(\\|\/)/],
			},
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
			filename: devMode ? '[name].css' : '[name].[contenthash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
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

		new SourceMapDevToolPlugin({
			filename: '[file].map[query]',
			moduleFilenameTemplate: '[resource-path]',
			fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
			sourceRoot: 'webpack:///',
		}),
	],
};
