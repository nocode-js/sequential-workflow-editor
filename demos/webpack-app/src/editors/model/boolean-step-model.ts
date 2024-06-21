import { createBooleanValueModel, createStepModel } from 'sequential-workflow-editor-model';
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
	step.description('This step demonstrates properties with boolean values.');

	step.property('zeroConfig').value(createBooleanValueModel({}));
	step.property('defaultValueTrue').value(
		createBooleanValueModel({
			defaultValue: true
		})
	);
	step.property('defaultValueFalse').value(
		createBooleanValueModel({
			defaultValue: false
		})
	);
});
