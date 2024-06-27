import { defaultI18n } from '../i18n';
import { variableNameValidator } from './variable-name-validator';

describe('VariableNameValidator', () => {
	const i18n = defaultI18n;

	it('creates correctly', () => {
		expect(variableNameValidator(i18n, 'a')).toBeNull();
		expect(variableNameValidator(i18n, 'ab')).toBeNull();
		expect(variableNameValidator(i18n, 'a-b-c')).toBeNull();
		expect(variableNameValidator(i18n, 'FooBar')).toBeNull();
		expect(variableNameValidator(i18n, 'foo_bar')).toBeNull();
		expect(variableNameValidator(i18n, 'item1')).toBeNull();
		expect(variableNameValidator(i18n, 'item_1')).toBeNull();
		expect(variableNameValidator(i18n, 'Item_1')).toBeNull();
		expect(variableNameValidator(i18n, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa_b')).toBeNull();

		expect(variableNameValidator(i18n, '1')).toContain('invalid characters');
		expect(variableNameValidator(i18n, 'fooBar&')).toContain('invalid characters');
		expect(variableNameValidator(i18n, '1_')).toContain('invalid characters');
		expect(variableNameValidator(i18n, '')).toContain('is required');
		expect(variableNameValidator(i18n, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa_bc')).toContain('32 characters or less');
	});
});
