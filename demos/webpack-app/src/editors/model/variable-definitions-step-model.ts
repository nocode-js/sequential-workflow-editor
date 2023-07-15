import { VariableDefinitions, createStepModel, createVariableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface VariableDefinitionsStepModel extends Step {
	type: 'variableDefinitions';
	componentType: 'task';
	properties: {
		zeroConfig: VariableDefinitions;
		numberAndBooleanOnly: VariableDefinitions;
		defaultValue: VariableDefinitions;
	};
}

export const variableDefinitionsStepModel = createStepModel<VariableDefinitionsStepModel>('variableDefinitions', 'task', step => {
	step.property('zeroConfig').value(createVariableDefinitionsValueModel({}));
	step.property('numberAndBooleanOnly').value(
		createVariableDefinitionsValueModel({
			valueTypes: ['number', 'boolean']
		})
	);
	step.property('defaultValue').value(
		createVariableDefinitionsValueModel({
			defaultValue: {
				variables: [
					{ name: 'x', type: 'number' },
					{ name: 'y', type: 'string' }
				]
			}
		})
	);
});
