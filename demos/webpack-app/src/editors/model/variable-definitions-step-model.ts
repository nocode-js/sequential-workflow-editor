import { VariableDefinitions, createStepModel, variableDefinitionsValueModel } from 'sequential-workflow-editor-model';
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
	step.property('zeroConfig').value(variableDefinitionsValueModel({}));
	step.property('numberAndBooleanOnly').value(
		variableDefinitionsValueModel({
			valueTypes: ['number', 'boolean']
		})
	);
	step.property('defaultValue').value(
		variableDefinitionsValueModel({
			defaultValue: {
				variables: [
					{ name: 'x', type: 'number' },
					{ name: 'y', type: 'string' }
				]
			}
		})
	);
});
