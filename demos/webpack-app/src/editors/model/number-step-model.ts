import { createStepModel, numberValueModel } from 'sequential-workflow-editor-model';
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
	step.property('zeroConfig').value(numberValueModel({}));
	step.property('defaultValue10').value(
		numberValueModel({
			defaultValue: 10
		})
	);
	step.property('min10').value(
		numberValueModel({
			min: 10
		})
	);
	step.property('max20').value(
		numberValueModel({
			max: 20
		})
	);
});
