import { NullableAnyVariable, createStepModel, nullableAnyVariableValueModel } from 'sequential-workflow-editor-model';
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
	step.property('source')
		.value(
			nullableAnyVariableValueModel({
				isRequired: true
			})
		)
		.label('Source variable');
	step.property('target')
		.value(
			nullableAnyVariableValueModel({
				isRequired: true
			})
		)
		.label('Target variable');
});
