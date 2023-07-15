import { createStepModel, createGeneratedStringValueModel, createNumberValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface GeneratedStringStepModel extends Step {
	type: 'generatedString';
	componentType: 'task';
	properties: {
		x: number;
		example: string;
	};
}

export const generatedStringStepModel = createStepModel<GeneratedStringStepModel>('generatedString', 'task', step => {
	step.property('x').value(createNumberValueModel({}));

	step.property('example')
		.dependentProperty('x')
		.value(
			createGeneratedStringValueModel({
				generator(context) {
					const x = context.getPropertyValue('x');
					switch (x) {
						case 0:
							return 'Only zero :(';
						case 1:
							return 'One! Nice! :)';
						case 2:
							return 'Two! Cool number! :))))';
					}
					if (x < 0) {
						return 'No no no! Negative number :(';
					}
					return 'Give me other number!';
				}
			})
		);
});
