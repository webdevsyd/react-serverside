import path from 'path';
import express from 'express';
import webpack from 'webpack';
import fs from 'file-system';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import reducers from './src/reducers';
import routes from './src/routes';

const app = express();

if(process.env.NODE_ENV === 'development') {
	const config = require('./webpack.config.dev');
	const compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	}));
	app.use(require('webpack-hot-middleware')(compiler));
	app.use(express.static(path.resolve(__dirname, 'src')));
} else if(process.env.NODE_ENV === 'production') {
	// app.use(express.static(path.resolve(__dirname, 'dist')));
	app.use("/css", express.static(__dirname + '/dist/css'));
	app.use("/js", express.static(__dirname + '/dist/js'));
}

app.get('*', (req, res) => {
	if(process.env.NODE_ENV == 'development'){
		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
			if(error) {
				res.status(500).send(error.message);
			} else if(redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search);
			} else if(renderProps) {
				res.status(200).send(`
					<!doctype html>
					<html>
						<head>
							<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
						</head>
						<body>
							<div id='app'></div>
							<script src='bundle.js'></script>
						</body>
					</html>
				`);
			}
		});
	}
	else if(process.env.NODE_ENV == 'production') {
		const filePath = path.resolve(__dirname,'dist', 'index.html')
		fs.readFile(filePath, 'utf8', (err, htmlData)=>{
			if (err) {
				console.error('read err', err)
				return res.status(404).end()
			}
			match({ routes, location: req.url }, (err, redirect, renderProps) => {
				if(err) {
					return res.status(404).end()
				} 
				else if(redirect) {
					res.redirect(302, redirect.pathname + redirect.search)
				} 
				else if(renderProps) {
					var ReactApp = renderToString(
						<Provider store={createStore(reducers)}>
							<RouterContext {...renderProps} />
						</Provider>
					);
					const RenderedApp = htmlData.replace('{{SSR}}', ReactApp);
					res.send(RenderedApp);
				} 
				else {
					return res.status(404).end()
				}
			})
		})
	}
});

app.listen(3000, '0.0.0.0', (err) => {
	if(err) {
		console.error(err);
	} else {
		console.info('Listening at http://localhost:3000');
	}
});
