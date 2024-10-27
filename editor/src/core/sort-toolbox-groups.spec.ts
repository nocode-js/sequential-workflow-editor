import { Step } from 'sequential-workflow-model';
import { sortToolboxGroups } from './sort-toolbox-groups';
import { ToolboxGroup } from '../editor-provider-configuration';

function createStep(name: string): Step {
	return {
		id: name,
		type: name,
		name,
		componentType: 'task',
		properties: {}
	};
}

describe('sortToolboxGroups', () => {
	it('sorts correctly', () => {
		const groups: ToolboxGroup[] = [
			{
				name: 'B',
				steps: [createStep('U'), createStep('B'), createStep('A')]
			},
			{
				name: 'A',
				steps: [createStep('G'), createStep('F'), createStep('C')]
			}
		];

		sortToolboxGroups(groups);

		expect(groups[0].name).toBe('A');
		expect(groups[0].steps[0].name).toBe('C');
		expect(groups[0].steps[1].name).toBe('F');
		expect(groups[0].steps[2].name).toBe('G');

		expect(groups[1].name).toBe('B');
		expect(groups[1].steps[0].name).toBe('A');
		expect(groups[1].steps[1].name).toBe('B');
		expect(groups[1].steps[2].name).toBe('U');
	});
});
