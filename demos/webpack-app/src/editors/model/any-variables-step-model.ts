import { AnyVariables, anyVariablesValueModel, createStepModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface AnyVariablesStepModel extends Step {
	type: 'anyVariables';
	componentType: 'task';
	properties: {
		zeroConfig: AnyVariables;
		onlyBoolean: AnyVariables;
	};
}

export const anyVariablesStepModel = createStepModel<AnyVariablesStepModel>('anyVariables', 'task', step => {
	step.property('zeroConfig').value(anyVariablesValueModel({}));
	step.property('onlyBoolean').value(
		anyVariablesValueModel({
			valueTypes: ['boolean']
		})
	);
});
