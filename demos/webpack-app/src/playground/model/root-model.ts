import { createRootModel, sequenceValueModel, variableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { MyDefinition } from './definition-model';

export const rootModel = createRootModel<MyDefinition>(root => {
	root.property('inputs')
		.value(variableDefinitionsValueModel({}))
		.dependentProperty('outputs')
		.customValidator({
			validate(context) {
				const inputs = context.getPropertyValue('outputs');
				return inputs.variables.length > 0 ? null : 'At least one input is required';
			}
		});
	root.property('outputs').value(
		variableDefinitionsValueModel({
			label: 'Outputs'
		})
	);
	root.sequence().value(
		sequenceValueModel({
			sequence: []
		})
	);
});
