import { createAtomActivity } from 'sequential-workflow-machine';
import { GlobalState } from '../global-state';
import { CalculateStep } from '../../model/calculate-step-model';

export const calculateActivity = createAtomActivity<CalculateStep, GlobalState>('calculate', {
	init: () => ({}),
	handler: async (step: CalculateStep, { $variables, $dynamics }: GlobalState) => {
		if (!step.properties.result) {
			throw new Error('Result variable is not defined');
		}

		const a = $dynamics.readNumber(step.properties.a);
		const b = $dynamics.readNumber(step.properties.b);

		const result = calculate(a, b, step.properties.operator);
		$variables.set(step.properties.result.name, result);
	}
});

function calculate(a: number, b: number, operator: string): number {
	switch (operator) {
		case '+':
			return a + b;
		case '-':
			return a - b;
		case '*':
			return a * b;
		case '/':
			return a / b;
		case '%':
			return a % b;
		default:
			throw new Error(`Unknown operator: ${operator}`);
	}
}
