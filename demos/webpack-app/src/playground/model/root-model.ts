import { createRootModel, createSequenceValueModel, createVariableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { MyDefinition } from './definition-model';

export const rootModel = createRootModel<MyDefinition>(root => {
	root.property('inputs')
		.hint('Variables passed to the workflow from the outside.')
		.value(createVariableDefinitionsValueModel({}))
		.dependentProperty('outputs')
		.validator({
			validate(context) {
				const inputs = context.getPropertyValue('outputs');
				return inputs.variables.length > 0 ? null : 'At least one input is required';
			}
		});

	root.property('outputs').hint('Variables returned from the workflow.').value(createVariableDefinitionsValueModel({})).label('Outputs');

	root.sequence().value(
		createSequenceValueModel({
			sequence: []
		})
	);
});
