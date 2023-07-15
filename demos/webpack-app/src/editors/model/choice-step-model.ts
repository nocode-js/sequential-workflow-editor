import { createChoiceValueModel, createStepModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface ChoiceStepModel extends Step {
	type: 'choice';
	componentType: 'task';
	properties: {
		minimalConfig: string;
		defaultValueGreen: string;
	};
}

export const choiceStepModel = createStepModel<ChoiceStepModel>('choice', 'task', step => {
	const choices = ['red', 'blue', 'green'];

	step.property('minimalConfig').value(createChoiceValueModel({ choices }));
	step.property('defaultValueGreen').value(createChoiceValueModel({ choices, defaultValue: 'green' }));
});
