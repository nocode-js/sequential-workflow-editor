import { createStepModel, createNumberValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface NumberStepModel extends Step {
	type: 'number';
	componentType: 'task';
	properties: {
		zeroConfig: number;
		defaultValue10: number;
		min10: number;
		max20: number;
	};
}

export const numberStepModel = createStepModel<NumberStepModel>('number', 'task', step => {
	step.property('zeroConfig').value(createNumberValueModel({}));
	step.property('defaultValue10').value(
		createNumberValueModel({
			defaultValue: 10
		})
	);
	step.property('min10').value(
		createNumberValueModel({
			min: 10
		})
	);
	step.property('max20').value(
		createNumberValueModel({
			max: 20
		})
	);
});
