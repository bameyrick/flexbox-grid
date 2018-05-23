const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');

const { EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');

module.exports = merge(commonConfig, {
	output: {
		filename: '[name].[chunkhash:20].js',
		chunkFilename: '[id].[chunkhash:20].js',
	},

	plugins: [
		new EnvironmentPlugin({
			NODE_ENV: 'production',
		}),

		new HashedModuleIdsPlugin({
			hashFunction: 'md5',
			hashDigest: 'base64',
			hashDigestLength: 4,
		}),
	]
});
