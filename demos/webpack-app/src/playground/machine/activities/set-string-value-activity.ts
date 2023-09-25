import { createAtomActivity } from 'sequential-workflow-machine';
import { GlobalState } from '../global-state';
import { SetStringValueStep } from '../../model/set-string-value-step-model';
import { TextVariableParser } from '../../utilities/text-variable-parser';

export const setStringValueActivity = createAtomActivity<SetStringValueStep, GlobalState>('setStringValue', {
	init: () => ({}),
	handler: async (step: SetStringValueStep, { $variables, $dynamics }: GlobalState) => {
		if (!step.properties.variable) {
			throw new Error('Variable is not set');
		}

		let value = $dynamics.readString(step.properties.value);

		value = TextVariableParser.replace(value, variableName => {
			return String($variables.read(variableName));
		});

		$variables.set(step.properties.variable.name, value);
	}
});
