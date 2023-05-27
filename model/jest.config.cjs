const path = require('path');

module.exports = {
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.(ts|js)x?$': 'ts-jest',
	},
	moduleNameMapper: {},
	transformIgnorePatterns: [
		'node_modules/(?!sequential-workflow-model)'
	],
};
