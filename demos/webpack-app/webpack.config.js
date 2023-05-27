const path = require('path');

module.exports = {
	entry: `./src/playground/app.ts`,
	cache: false,
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'playground.js',
		path: path.resolve(__dirname, 'public/builds'),
	},
};
