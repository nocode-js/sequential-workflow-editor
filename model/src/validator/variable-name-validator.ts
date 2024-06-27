import { I18n } from '../i18n';

const MAX_LENGTH = 32;

export function variableNameValidator(i18n: I18n, name: string): string | null {
	if (!name) {
		return i18n('variableName.required', 'Variable name is required');
	}
	if (name.length > MAX_LENGTH) {
		return i18n('variableName.maxLength', 'Variable name must be :n characters or less', {
			n: String(MAX_LENGTH)
		});
	}
	if (!/^[A-Za-z][a-zA-Z_0-9-]*$/.test(name)) {
		return i18n('variableName.invalidCharacters', 'Variable name contains invalid characters');
	}
	return null;
}
