import {
	Dynamic,
	NullableVariable,
	ValueKnownType,
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
	};
}

export const logStepModel = createStepModel<LogStep>('log', 'task', step => {
	step.property('message')
		.value(
			dynamicValueModel({
				choices: [
					stringValueModel({
						minLength: 1
					}),
					nullableVariableValueModel({
						isRequired: true,
						variableType: ValueKnownType.string
					})
				]
			})
		)
		.label('Text');
});
