const MAX_LENGTH = 32;

export function variableNameValidator(name: string): string | null {
	if (!name) {
		return 'Variable name is required.';
	}
	if (name.length > MAX_LENGTH) {
		return `Variable name must be ${MAX_LENGTH} characters or less.`;
	}
	if (!/^[A-Za-z][a-zA-Z_0-9-]*$/.test(name)) {
		return 'Variable name contains invalid characters.';
	}
	return null;
}
