import { variableNameValidator } from './variable-name-validator';

describe('VariableNameValidator', () => {
	it('creates correctly', () => {
		expect(variableNameValidator('a')).toBeNull();
		expect(variableNameValidator('ab')).toBeNull();
		expect(variableNameValidator('a-b-c')).toBeNull();
		expect(variableNameValidator('FooBar')).toBeNull();
		expect(variableNameValidator('foo_bar')).toBeNull();
		expect(variableNameValidator('item1')).toBeNull();
		expect(variableNameValidator('item_1')).toBeNull();
		expect(variableNameValidator('Item_1')).toBeNull();
		expect(variableNameValidator('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa_b')).toBeNull();

		expect(variableNameValidator('1')).toContain('invalid characters');
		expect(variableNameValidator('fooBar&')).toContain('invalid characters');
		expect(variableNameValidator('1_')).toContain('invalid characters');
		expect(variableNameValidator('')).toContain('is required');
		expect(variableNameValidator('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa_bc')).toContain('32 characters or less');
	});
});
