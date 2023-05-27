import { AnyVariables, anyVariablesValueModel, createStepModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface DumpVariablesStep extends Step {
	type: 'dumpVariables';
	componentType: 'task';
	properties: {
		variables: AnyVariables;
	};
}

export const dumpVariablesStepModel = createStepModel<DumpVariablesStep>('dumpVariables', 'task', step => {
	step.property('variables').value(anyVariablesValueModel({})).label('Select variables');
});
