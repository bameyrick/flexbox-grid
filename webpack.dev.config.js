const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common.config');

const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];

module.exports = merge(commonConfig, {
	mode: 'development',

	plugins: [
		new HtmlWebpackPlugin({
			filetype: 'pug',
			template: './src/views/index.pug',
			filename: './index.html',
			hash: false,
			inject: true,
			compile: true,
			favicon: false,
			minify: false,
			cache: true,
			showErrors: true,
			chunks: 'all',
			excludeChunks: [],
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
	],

	node: {
		fs: 'empty',
		global: true,
		crypto: 'empty',
		tls: 'empty',
		net: 'empty',
		process: true,
		module: false,
		clearImmediate: false,
		setImmediate: false,
	},

	devServer: {
		historyApiFallback: true,
	},
});
