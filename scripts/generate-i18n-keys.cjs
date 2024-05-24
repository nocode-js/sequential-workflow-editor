// Usage: node generate-i18n-keys.cjs

const fs = require('fs');
const path = require('path');

function* walkDir(dirPath) {
	const files = fs.readdirSync(dirPath, { withFileTypes: true });
	for (const file of files) {
		if (file.isDirectory()) {
			yield* walkDir(path.join(dirPath, file.name));
		} else {
			yield path.join(dirPath, file.name);
		}
	}
}

function processDir(dirPath) {
	const dict = {};
	for (const file of walkDir(path.join(__dirname, dirPath))) {
		if (file.endsWith('.ts')) {
			const content = fs.readFileSync(file, 'utf8');
			const items = content.match(/i18n\s*\([^)]+/g);
			if (items) {
				items.forEach(item => {
					const values = item.match(/'([^']+)'/g);
					if (values?.length === 2) {
						dict[values[0].slice(1, -1)] = values[1].slice(1, -1);
					}
				});
			}
		}
	}
	return dict;
}

function sortDict(dict) {
	const keys = Object.keys(dict);
	keys.sort((a, b) => a.localeCompare(b));
	return keys.reduce((result, key) => {
		result[key] = dict[key];
		return result;
	}, {});

}

const sortedDict = sortDict({
	...processDir('../model/src'),
	...processDir('../editor/src')
});

let output = '# I18N Keys\n\n';
output += 'This document lists all the I18N keys used in the Sequential Workflow Editor.\n\n';
output += '```json\n' + JSON.stringify(sortedDict, null, 2) + '\n```\n';

fs.writeFileSync(path.join(__dirname, '../docs/I18N-KEYS.md'), output);

console.log(sortedDict);
