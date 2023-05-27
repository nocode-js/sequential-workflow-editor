import { MyDefinition } from './model/definition-model';

export function tryReadDefinition(): MyDefinition | null {
	const raw = localStorage['definition'];
	if (raw) {
		return JSON.parse(raw);
	}
	return null;
}

export function saveDefinition(definition: MyDefinition) {
	localStorage['definition'] = JSON.stringify(definition);
}
