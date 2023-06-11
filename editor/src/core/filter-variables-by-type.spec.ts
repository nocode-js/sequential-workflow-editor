import { ContextVariable, Path } from 'sequential-workflow-editor-model';
import { filterVariablesByType } from './filter-variables-by-type';

describe('filterVariablesByType', () => {
	const variables: ContextVariable[] = [
		{
			name: 'blue',
			stepId: '0x1',
			type: 'string',
			valueModelPath: Path.root()
		},
		{
			name: 'green',
			stepId: '0x2',
			type: 'number',
			valueModelPath: Path.root()
		},
		{
			name: 'pink',
			stepId: '0x3',
			type: 'boolean',
			valueModelPath: Path.root()
		}
	];

	it('returns filtered list when passed string', () => {
		const result = filterVariablesByType(variables, 'string');
		expect(result.length).toBe(1);
		expect(result[0].name).toBe('blue');
	});

	it('returns filtered list when passed array', () => {
		const result = filterVariablesByType(variables, ['number', 'boolean']);
		expect(result.length).toBe(2);
		expect(result[0].name).toBe('green');
		expect(result[1].name).toBe('pink');
	});

	it('returns empty array if expected types are not found', () => {
		const result = filterVariablesByType(variables, ['date', 'time']);
		expect(result.length).toBe(0);
	});

	it('returns source list if filter is not passed', () => {
		const result = filterVariablesByType(variables, undefined);
		expect(result.length).toBe(3);
		expect(result[0].name).toBe('blue');
		expect(result[1].name).toBe('green');
		expect(result[2].name).toBe('pink');
	});
});
