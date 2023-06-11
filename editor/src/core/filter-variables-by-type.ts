import { ContextVariable, ValueType } from 'sequential-workflow-editor-model';

export function filterVariablesByType(variables: ContextVariable[], valueType: ValueType | ValueType[] | undefined): ContextVariable[] {
	if (!valueType) {
		return variables;
	}
	const filter = Array.isArray(valueType)
		? (variable: ContextVariable) => valueType.includes(variable.type)
		: (variable: ContextVariable) => variable.type === valueType;
	return variables.filter(filter);
}
