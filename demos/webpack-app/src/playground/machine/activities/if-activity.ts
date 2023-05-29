import { branchName, createForkActivity } from 'sequential-workflow-machine';
import { IfStep } from '../../model/if-step-model';
import { GlobalState } from '../global-state';

export const ifActivity = createForkActivity<IfStep, GlobalState>({
	stepType: 'if',
	init: () => ({}),
	handler: async (step: IfStep, { $dynamics }: GlobalState) => {
		const a = $dynamics.readNumber(step.properties.a);
		const b = $dynamics.readNumber(step.properties.b);

		const result = compare(a, b, step.properties.operator);
		return branchName(result ? 'true' : 'false');
	}
});

function compare(a: number, b: number, operator: string): boolean {
	switch (operator) {
		case '=':
			return a === b;
		case '!=':
			return a !== b;
		case '>':
			return a > b;
		case '>=':
			return a >= b;
		case '<':
			return a < b;
		case '<=':
			return a <= b;
		default:
			throw new Error(`Unknown operator: ${operator}`);
	}
}
