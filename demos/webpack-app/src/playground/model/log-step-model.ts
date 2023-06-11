import {
	AnyVariables,
	Dynamic,
	NullableVariable,
	ValueKnownType,
	anyVariablesValueModel,
	createStepModel,
	dynamicValueModel,
	nullableVariableValueModel,
	stringValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface LogStep extends Step {
	type: 'log';
	componentType: 'task';
	properties: {
		message: Dynamic<string | NullableVariable>;
		variables: AnyVariables;
	};
}

export const logStepModel = createStepModel<LogStep>('log', 'task', step => {
	step.property('message')
		.value(
			dynamicValueModel({
				models: [
					stringValueModel({
						minLength: 1
					}),
					nullableVariableValueModel({
						isRequired: true,
						valueType: ValueKnownType.string
					})
				]
			})
		)
		.label('Text');

	step.property('variables').value(anyVariablesValueModel({})).label('Log variables');
});
