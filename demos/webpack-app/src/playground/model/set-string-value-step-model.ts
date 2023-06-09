import {
	Dynamic,
	NullableVariable,
	WellKnownValueType,
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

export const setStringValueStepModel = createStepModel<SetStringValueStep>('setStringValue', 'task', step => {
	step.category('Values');

	step.property('variable')
		.value(
			nullableVariableValueModel({
				valueType: WellKnownValueType.string,
				isRequired: true
			})
		)
		.label('Target variable');
	step.property('value')
		.value(
			dynamicValueModel({
				models: [
					stringValueModel({
						minLength: 1
					}),
					nullableVariableValueModel({
						valueType: WellKnownValueType.string,
						isRequired: true
					})
				]
			})
		)
		.label('Value');
});
