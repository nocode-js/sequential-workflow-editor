import { createAtomActivity } from 'sequential-workflow-machine';
import { GlobalState } from '../global-state';
import { SetStringValueStep } from '../../model/set-string-value-step-model';

export const setStringValueActivity = createAtomActivity<SetStringValueStep, GlobalState>('setStringValue', {
	init: () => ({}),
	handler: async (step: SetStringValueStep, { $variables, $dynamics }: GlobalState) => {
		if (!step.properties.variable) {
			throw new Error('Variable is not set');
		}

		const value = $dynamics.readString(step.properties.value);
		$variables.set(step.properties.variable.name, value);
	}
});
