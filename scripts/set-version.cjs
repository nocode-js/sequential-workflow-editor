const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version || !(/^\d+\.\d+\.\d+$/.test(version))) {
	console.log('Usage: node set-version.js 1.2.3');
	return;
}

const dependencies = [
	'sequential-workflow-editor-model',
	'sequential-workflow-editor'
];

function updateDependencies(deps) {
	if (!deps) {
		return;
	}
	for (const name in deps) {
		if (dependencies.includes(name)) {
			deps[name] = `^${version}`;
		}
	}
}

function updatePackage(filePath, setVersion) {
	filePath = path.join(__dirname, '..', filePath);
	const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

	if (setVersion) {
		json['version'] = version;
	}
	updateDependencies(json['dependencies']);
	updateDependencies(json['peerDependencies']);
	updateDependencies(json['devDependencies']);

	fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'), 'utf-8');
}

updatePackage('model/package.json', true);
updatePackage('editor/package.json', true);
updatePackage('demos/webpack-app/package.json', false);
