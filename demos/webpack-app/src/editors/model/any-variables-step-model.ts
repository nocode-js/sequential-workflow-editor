import { AnyVariables, createAnyVariablesValueModel, createStepModel } from 'sequential-workflow-editor-model';
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
	step.description('In this step, you can select a collection of variables of any type.');

	step.property('zeroConfig').value(createAnyVariablesValueModel({}));
	step.property('onlyBoolean').value(
		createAnyVariablesValueModel({
			valueTypes: ['boolean']
		})
	);
});
