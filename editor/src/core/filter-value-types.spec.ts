import { filterValueTypes } from './filter-value-types';

describe('filterValueTypes', () => {
	it('filters correctly if passed array', () => {
		const result = filterValueTypes(['number', 'string'], ['number']);
		expect(result.length).toBe(1);
		expect(result[0]).toBe('number');
	});

	it('filters correctly if passed empty array', () => {
		const result = filterValueTypes(['number', 'string'], []);
		expect(result.length).toBe(0);
	});

	it('does not filter if second argument is undefined', () => {
		const result = filterValueTypes(['number', 'string'], undefined);
		expect(result.length).toBe(2);
		expect(result[0]).toBe('number');
		expect(result[1]).toBe('string');
	});
});
