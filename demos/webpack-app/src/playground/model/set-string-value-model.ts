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

export interface SetStringValueStep extends Step {
	type: 'setStringValue';
	componentType: 'task';
	properties: {
		variable: NullableVariable;
		value: Dynamic<string | NullableVariable>;
	};
}

export const setStringValueModel = createStepModel<SetStringValueStep>('setStringValue', 'task', step => {
	step.property('variable')
		.value(
			nullableVariableValueModel({
				variableType: ValueKnownType.string,
				isRequired: true
			})
		)
		.label('Target variable');
	step.property('value')
		.value(
			dynamicValueModel({
				choices: [
					stringValueModel({
						minLength: 1
					}),
					nullableVariableValueModel({
						variableType: ValueKnownType.string,
						isRequired: true
					})
				]
			})
		)
		.label('Value');
});
