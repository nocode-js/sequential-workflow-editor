import { WorkflowMachineSnapshot, createWorkflowMachineBuilder } from 'sequential-workflow-machine';
import { GlobalState } from './global-state';
import { activitySet } from './activity-set';
import { MyDefinition } from '../model/definition-model';
import { VariableState, VariablesService, createVariableState } from './services/variables-service';
import { DynamicsService } from './services/dynamics-service';

const builder = createWorkflowMachineBuilder<GlobalState>(activitySet);

export function executeMachine(
	definition: MyDefinition,
	variableValues: VariableState,
	onStateChanged: (path: string) => void
): Promise<WorkflowMachineSnapshot<GlobalState>> {
	const machine = builder.build(definition);
	const interpreter = machine.create({
		init: () => {
			const variablesState = createVariableState(variableValues);
			const $variables = new VariablesService(variablesState);
			const $dynamics = new DynamicsService($variables);

			return {
				startTime: new Date(),
				variablesState,

				$variables,
				$dynamics
			};
		}
	});

	return new Promise((resolve, reject) => {
		try {
			interpreter.onChange(() => {
				const snapshot = interpreter.getSnapshot();
				onStateChanged(snapshot.statePath.join('/'));
			});
			interpreter.onDone(() => {
				resolve(interpreter.getSnapshot());
			});
			interpreter.start();
		} catch (e) {
			reject(e);
		}
	});
}
