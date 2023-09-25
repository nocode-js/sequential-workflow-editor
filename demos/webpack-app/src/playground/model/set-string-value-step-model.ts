import {
	Dynamic,
	NullableVariable,
	WellKnownValueType,
	createStepModel,
	createDynamicValueModel,
	createNullableVariableValueModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';
import { TextVariableParser } from '../utilities/text-variable-parser';

export interface SetStringValueStep extends Step {
	type: 'setStringValue';
	componentType: 'task';
	properties: {
		variable: NullableVariable;
		value: Dynamic<string | NullableVariable>;
	};
}

export const setStringValueStepModel = createStepModel<SetStringValueStep>('setStringValue', 'task', step => {
	step.category('Values');

	step.property('variable')
		.value(
			createNullableVariableValueModel({
				valueType: WellKnownValueType.string,
				isRequired: true
			})
		)
		.label('Target variable');
	step.property('value')
		.value(
			createDynamicValueModel({
				models: [
					createStringValueModel({
						minLength: 1
					}),
					createNullableVariableValueModel({
						valueType: WellKnownValueType.string,
						isRequired: true
					})
				]
			})
		)
		.label('Value')
		.validator({
			validate(context) {
				const value = context.getValue();
				if (value.modelId === 'string') {
					const variables = TextVariableParser.parse(value.value as string);
					const notFoundIndex = context.hasVariables(variables).findIndex(v => !v);
					if (notFoundIndex >= 0) {
						return `Variable $${variables[notFoundIndex]} is not defined`;
					}
				}
				return null;
			}
		});
});
