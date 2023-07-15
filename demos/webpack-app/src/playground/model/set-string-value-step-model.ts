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
		.label('Value');
});
