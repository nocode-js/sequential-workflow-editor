import { createAtomActivity } from 'sequential-workflow-machine';
import { GlobalState } from '../global-state';
import { LogStep } from '../../model/log-step-model';
import { formatVariableName } from 'sequential-workflow-editor';

export const logActivity = createAtomActivity<LogStep, GlobalState>({
	init: () => ({}),
	stepType: 'log',
	handler: async (step: LogStep, { $variables, $dynamics, $logger }: GlobalState) => {
		let message = $dynamics.readString(step.properties.message);

		for (const variable of step.properties.variables.variables) {
			const value = $variables.isSet(variable.name) ? $variables.read(variable.name) || '<empty>' : '<not set>';
			const type = typeof value;
			const name = formatVariableName(variable.name);
			message += `\n${name}=${value} (${type})`;
		}

		$logger.log(message);
	}
});
