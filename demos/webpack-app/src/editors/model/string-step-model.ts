import { createStepModel, stringValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface StringStepModel extends Step {
	type: 'string';
	componentType: 'task';
	properties: {
		zeroConfig: string;
		defaultValue: string;
		minLength3: string;
		patternYear: string;
		multiLine: string;
	};
}

export const stringStepModel = createStepModel<StringStepModel>('string', 'task', step => {
	step.property('zeroConfig').value(stringValueModel({}));
	step.property('defaultValue').value(
		stringValueModel({
			defaultValue: 'Some default value'
		})
	);
	step.property('minLength3').value(
		stringValueModel({
			minLength: 3
		})
	);
	step.property('patternYear').value(
		stringValueModel({
			pattern: /^\d{4}$/
		})
	);
	step.property('multiLine').value(
		stringValueModel({
			multiline: true
		})
	);
});
