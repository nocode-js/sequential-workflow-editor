import { createLoopActivity } from 'sequential-workflow-machine';
import { LoopStep } from '../../model/loop-step-model';
import { GlobalState } from '../global-state';

interface LoopActivityState {
	indexVariableName: string;
}

export const loopActivity = createLoopActivity<LoopStep, GlobalState, LoopActivityState>('loop', {
	loopName: step => `LOOP.${step.id}`,
	init: (step: LoopStep) => {
		if (!step.properties.indexVariable) {
			throw new Error('Index variable is not defined');
		}
		return {
			indexVariableName: step.properties.indexVariable.name
		};
	},
	onEnter: (step: LoopStep, { $variables, $dynamics }: GlobalState, { indexVariableName }: LoopActivityState) => {
		const startIndex = $dynamics.readNumber(step.properties.from);

		$variables.set(indexVariableName, startIndex);
	},
	onLeave: (_, { $variables }: GlobalState, { indexVariableName }: LoopActivityState) => {
		$variables.delete(indexVariableName);
	},
	condition: async (step: LoopStep, { $variables, $dynamics }: GlobalState, { indexVariableName }: LoopActivityState) => {
		const from = $dynamics.readNumber(step.properties.to);
		const increment = $dynamics.readNumber(step.properties.increment);
		if (increment === 0) {
			throw new Error('Increment cannot be 0');
		}

		const currentIndex = $variables.read<number>(indexVariableName);

		let canContinue: boolean;
		switch (step.properties.operator) {
			case '<':
				canContinue = currentIndex < from;
				break;
			case '<=':
				canContinue = currentIndex <= from;
				break;
			default:
				throw new Error('Comparison is not supported');
		}

		const newIndex = currentIndex + increment;

		$variables.set(indexVariableName, newIndex);
		return canContinue;
	}
});
