import { NullableVariable, createStepModel, nullableVariableValueModel } from 'sequential-workflow-editor-model';
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
		nullableVariableValueModel({
			valueType: 'number'
		})
	);
	step.property('required').value(
		nullableVariableValueModel({
			valueType: 'number',
			isRequired: true
		})
	);
});
