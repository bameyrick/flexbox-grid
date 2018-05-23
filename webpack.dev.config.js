const merge = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
	mode: 'development',

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
