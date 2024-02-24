/* global location, document */

function isTestEnv() {
	const hostname = location.hostname.toLowerCase();
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
}

function embedScript(url) {
	document.write(`<script src="${url}"></script>`);
}

function embedStylesheet(url) {
	document.write(`<link href="${url}" rel="stylesheet">`);
}

const modelBaseUrl = isTestEnv() ? '../../model' : '//cdn.jsdelivr.net/npm/sequential-workflow-editor-model@0.11.3';
const editorBaseUrl = isTestEnv() ? '../../editor' : '//cdn.jsdelivr.net/npm/sequential-workflow-editor@0.11.3';

embedScript(`${modelBaseUrl}/dist/index.umd.js`);
embedScript(`${editorBaseUrl}/dist/index.umd.js`);
embedStylesheet(`${editorBaseUrl}/css/editor.css`);
