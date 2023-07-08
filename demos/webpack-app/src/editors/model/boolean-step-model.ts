import { booleanValueModel, createStepModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface BooleanStepModel extends Step {
	type: 'boolean';
	componentType: 'task';
	properties: {
		zeroConfig: boolean;
		defaultValueTrue: boolean;
		defaultValueFalse: boolean;
	};
}

export const booleanStepModel = createStepModel<BooleanStepModel>('boolean', 'task', step => {
	step.property('zeroConfig').value(booleanValueModel({}));
	step.property('defaultValueTrue').value(
		booleanValueModel({
			defaultValue: true
		})
	);
	step.property('defaultValueFalse').value(
		booleanValueModel({
			defaultValue: false
		})
	);
});
