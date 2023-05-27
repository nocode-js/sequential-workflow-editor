import { buildLabel } from './label-builder';

describe('buildLabel', () => {
	it('creates label', () => {
		expect(buildLabel('test')).toBe('Test');
		expect(buildLabel('TEST')).toBe('TEST');
	});
});
