import { createAtomActivity } from 'sequential-workflow-machine';
import { GlobalState } from '../global-state';
import { ConvertValueStep } from '../../model/convert-value-step-model';

export const convertValueActivity = createAtomActivity<ConvertValueStep, GlobalState>('convertValue', {
	init: () => ({}),
	handler: async (step: ConvertValueStep, { $variables }: GlobalState) => {
		if (!step.properties.source) {
			throw new Error('Source variable is required');
		}
		if (!step.properties.target) {
			throw new Error('Target variable is required');
		}

		const value = $variables.read(step.properties.source.name);

		let convertedValue: unknown;
		switch (step.properties.target.type) {
			case 'number':
				convertedValue = Number(value);
				break;
			case 'string':
				convertedValue = String(value);
				break;
			default:
				throw new Error(`Unsupported target type: ${step.properties.target.type}`);
		}

		$variables.set(step.properties.target.name, convertedValue);
	}
});
