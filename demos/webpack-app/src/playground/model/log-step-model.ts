import {
	AnyVariables,
	Dynamic,
	GeneratedStringContext,
	NullableVariable,
	WellKnownValueType,
	createAnyVariablesValueModel,
	createDynamicValueModel,
	createGeneratedStringValueModel,
	createNullableVariableValueModel,
	createStepModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface LogStep extends Step {
	type: 'log';
	componentType: 'task';
	properties: {
		message: Dynamic<string | NullableVariable>;
		variables: AnyVariables;
		note: Dynamic<string>;
	};
}

export const logStepModel = createStepModel<LogStep>('log', 'task', step => {
	step.property('message')
		.value(
			createDynamicValueModel({
				models: [
					createStringValueModel({
						minLength: 1
					}),
					createNullableVariableValueModel({
						isRequired: true,
						valueType: WellKnownValueType.string
					})
				]
			})
		)
		.label('Text');

	step.property('variables').value(createAnyVariablesValueModel({})).label('Log variables');

	step.property('note')
		.dependentProperty('variables')
		.value(
			createDynamicValueModel({
				models: [
					createGeneratedStringValueModel({
						generator: (context: GeneratedStringContext<LogStep['properties']>) => {
							// TODO: if the type would be deleted from arguments, then the auto type is wrong.
							const variables = context.getPropertyValue('variables');
							return `Dumped ${variables.variables.length} variables`;
						}
					}),
					createStringValueModel({})
				]
			})
		);
});
