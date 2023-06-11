import { formatVariableName, formatVariableNameWithType } from './variable-name-formatter';

describe('formatVariableName', () => {
	it('returns proper name', () => {
		expect(formatVariableName('lastName')).toBe('$lastName');
	});
});

describe('formatVariableNameWithType', () => {
	it('returns proper name', () => {
		expect(formatVariableNameWithType('foo', 'string')).toBe('$foo (string)');
	});
});
