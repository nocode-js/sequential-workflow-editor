import { NullableAnyVariable, createStepModel, nullableAnyVariableValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface NullableAnyVariableStepModel extends Step {
	type: 'nullableAnyVariable';
	componentType: 'task';
	properties: {
		zeroConfig: NullableAnyVariable;
		required: NullableAnyVariable;
		onlyNumber: NullableAnyVariable;
	};
}

export const nullableAnyVariableStepModel = createStepModel<NullableAnyVariableStepModel>('nullableAnyVariable', 'task', step => {
	step.property('zeroConfig').value(nullableAnyVariableValueModel({}));
	step.property('required').value(
		nullableAnyVariableValueModel({
			isRequired: true
		})
	);
	step.property('onlyNumber').value(
		nullableAnyVariableValueModel({
			valueTypes: ['number']
		})
	);
});
