import { NullableVariable, createStepModel, createNullableVariableValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface NullableVariableStepModel extends Step {
	type: 'nullableVariable';
	componentType: 'task';
	properties: {
		minimalConfig: NullableVariable;
		required: NullableVariable;
	};
}

export const nullableVariableStepModel = createStepModel<NullableVariableStepModel>('nullableVariable', 'task', step => {
	step.property('minimalConfig').value(
		createNullableVariableValueModel({
			valueType: 'number'
		})
	);
	step.property('required').value(
		createNullableVariableValueModel({
			valueType: 'number',
			isRequired: true
		})
	);
});
