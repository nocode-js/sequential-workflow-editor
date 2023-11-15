import { createStepModel, createStringValueModel } from 'sequential-workflow-editor-model';
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
	step.property('zeroConfig').value(createStringValueModel({}));
	step.property('defaultValue').value(
		createStringValueModel({
			defaultValue: 'Some default value'
		})
	);
	step.property('minLength3')
		.value(
			createStringValueModel({
				minLength: 3,
				editorId: 'string-magic'
			})
		)
		.hint('This editor has a different color than the others, because it uses the string editor with custom CSS class.');
	step.property('patternYear').value(
		createStringValueModel({
			pattern: /^\d{4}$/
		})
	);
	step.property('multiLine').value(
		createStringValueModel({
			multiline: true
		})
	);
});
