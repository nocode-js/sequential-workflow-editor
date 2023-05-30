import { formatVariableName } from './variable-name-formatter';

describe('formatVariableName', () => {
	it('returns proper name', () => {
		expect(formatVariableName('lastName')).toBe('$lastName');
	});
});
