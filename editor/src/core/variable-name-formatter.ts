export function formatVariableName(name: string): string {
	return `$${name}`;
}

export function formatVariableNameWithType(name: string, type: string): string {
	return `${formatVariableName(name)} (${type})`;
}
