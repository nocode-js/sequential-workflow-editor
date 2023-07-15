import { NullableAnyVariable, createStepModel, createNullableAnyVariableValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface ConvertValueStep extends Step {
	type: 'convertValue';
	componentType: 'task';
	properties: {
		source: NullableAnyVariable;
		target: NullableAnyVariable;
	};
}

export const convertValueStepModel = createStepModel<ConvertValueStep>('convertValue', 'task', step => {
	step.category('Values');
	step.description('Convert value from one variable to another.');

	step.property('source')
		.value(
			createNullableAnyVariableValueModel({
				isRequired: true
			})
		)
		.label('Source variable');
	step.property('target')
		.value(
			createNullableAnyVariableValueModel({
				isRequired: true
			})
		)
		.label('Target variable');
});
