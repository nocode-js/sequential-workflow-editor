import { NullableVariableDefinition, createStepModel, nullableVariableDefinitionValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface NullableVariableDefinitionStepModel extends Step {
	type: 'nullableVariableDefinition';
	componentType: 'task';
	properties: {
		minimalConfig: NullableVariableDefinition;
		required: NullableVariableDefinition;
		defaultValue: NullableVariableDefinition;
	};
}

export const nullableVariableDefinitionStepModel = createStepModel<NullableVariableDefinitionStepModel>(
	'nullableVariableDefinition',
	'task',
	step => {
		step.property('minimalConfig').value(
			nullableVariableDefinitionValueModel({
				valueType: 'number'
			})
		);
		step.property('required').value(
			nullableVariableDefinitionValueModel({
				valueType: 'number',
				isRequired: true
			})
		);

		step.property('defaultValue').value(
			nullableVariableDefinitionValueModel({
				valueType: 'number',
				defaultValue: {
					name: 'index',
					type: 'number'
				}
			})
		);
	}
);
