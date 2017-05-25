const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: [
			path.resolve(__dirname, 'src'),
		],
		vendor: [
			'react'
		]
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[chunkhash].js',
		chunkFilename: 'js/[name].[chunkhash].js'
	},

	devtool: 'cheap-module-source-map',

	module: {
		loaders: [
			{
				test: /\.js(x?)$/,
				loader: 'babel-loader',
				include: path.resolve(__dirname, 'src')
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'file-loader?name=assets/[hash].[ext]'
			},
			{
				test: /\.scss/,
				loader: ExtractTextPlugin.extract('style', 'css!sass!postcss'),
				include: path.resolve(__dirname, 'src')
			}
		]
	},
	postcss: function() {
		return [autoprefixer];
	},
	plugins: [

		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				WEBPACK: true
			}
		}),

		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: true,
			beautify: false,
			comments: false,
			dead_code: true,
			compress: {
				warnings: false,
				drop_console: true
			}
		}),

		new webpack.optimize.DedupePlugin(),
		
		new webpack.optimize.OccurenceOrderPlugin(),
		
		new ExtractTextPlugin('css/bundle.[contenthash].css'),

		new HtmlWebpackPlugin({
			title: 'React Starter Kit',
			hash: true,
			inject: true,
			appMountId: 'app',
			template: 'ejs!src/views/index.ejs'
		})
	]
};
