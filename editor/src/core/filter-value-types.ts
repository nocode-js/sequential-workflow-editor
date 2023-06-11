import { ValueType } from 'sequential-workflow-editor-model';

export function filterValueTypes(types: ValueType[], allowedTypes: ValueType[] | undefined): ValueType[] {
	if (!allowedTypes) {
		return types;
	}
	const result: ValueType[] = [];
	for (const type of types) {
		if (allowedTypes.includes(type)) {
			result.push(type);
		}
	}
	return result;
}
