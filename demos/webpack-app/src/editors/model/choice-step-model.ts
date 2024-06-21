import { createChoiceValueModel, createStepModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface ChoiceStepModel extends Step {
	type: 'choice';
	componentType: 'task';
	properties: {
		minimalConfig: string;
		defaultValueAllow: 'allow' | 'ignore' | 'deny';
	};
}

export const choiceStepModel = createStepModel<ChoiceStepModel>('choice', 'task', step => {
	step.description('In this step, you can see properties that allow you to select a value from a predefined list.');

	step.property('minimalConfig').value(createChoiceValueModel({ choices: ['red', 'blue', 'green'] }));

	step.property('defaultValueAllow').value(
		createChoiceValueModel({
			choices: ['allow', 'ignore'],
			defaultValue: 'ignore'
		})
	);
});
