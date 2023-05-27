import { createAtomActivity } from 'sequential-workflow-machine';
import { GlobalState } from '../global-state';
import { LogStep } from '../../model/log-step-model';

export const logActivity = createAtomActivity<LogStep, GlobalState>({
	init: () => ({}),
	stepType: 'log',
	handler: async (step: LogStep, { $dynamics }: GlobalState) => {
		const message = $dynamics.readAny(step.properties.message);
		console.log(`log: ${message}`);
	}
});
