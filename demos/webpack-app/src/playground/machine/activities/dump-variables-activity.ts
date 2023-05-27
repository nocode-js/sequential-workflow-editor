import { createAtomActivity } from 'sequential-workflow-machine';
import { GlobalState } from '../global-state';
import { DumpVariablesStep } from '../../model/dump-variables-step-model';

export const dumpVariablesActivity = createAtomActivity<DumpVariablesStep, GlobalState>({
	init: () => ({}),
	stepType: 'dumpVariables',
	handler: async (step: DumpVariablesStep, { $variables }: GlobalState) => {
		for (const variable of step.properties.variables.variables) {
			const value = $variables.isSet(variable.name) ? $variables.read(variable.name) : '<not set>';
			const type = typeof value;
			console.log(`${variable.name}: ${value} (${type})`);
		}
	}
});
