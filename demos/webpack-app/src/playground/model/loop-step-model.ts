import {
	Dynamic,
	NullableVariable,
	NullableVariableDefinition,
	ValueKnownType,
	VariableDefinitions,
	choiceValueModel,
	createSequentialStepModel,
	dynamicValueModel,
	nullableVariableDefinitionValueModel,
	nullableVariableValueModel,
	numberValueModel,
	variableDefinitionsValueModel
} from 'sequential-workflow-editor-model';
import { SequentialStep } from 'sequential-workflow-model';

export interface LoopStep extends SequentialStep {
	type: 'loop';
	componentType: 'container';
	properties: {
		from: Dynamic<number | NullableVariable>;
		to: Dynamic<number | NullableVariable>;
		increment: Dynamic<number | NullableVariable>;
		operator: string;
		indexVariable: NullableVariableDefinition;
		variables: VariableDefinitions;
	};
}

export const loopStepModel = createSequentialStepModel('loop', 'container', step => {
	step.property('from')
		.label('From')
		.value(
			dynamicValueModel({
				models: [
					numberValueModel({}),
					nullableVariableValueModel({
						isRequired: true,
						valueType: ValueKnownType.number
					})
				]
			})
		);

	step.property('operator')
		.label('Operator')
		.value(
			choiceValueModel({
				choices: ['<', '<=']
			})
		);

	step.property('to')
		.label('To')
		.value(
			dynamicValueModel({
				models: [
					numberValueModel({}),
					nullableVariableValueModel({
						isRequired: true,
						valueType: ValueKnownType.number
					})
				]
			})
		);

	step.property('increment')
		.label('Increment')
		.value(
			dynamicValueModel({
				models: [
					numberValueModel({
						defaultValue: 1
					}),
					nullableVariableValueModel({
						isRequired: true,
						valueType: ValueKnownType.number
					})
				]
			})
		);

	step.property('indexVariable')
		.label('Index variable')
		.value(
			nullableVariableDefinitionValueModel({
				valueType: ValueKnownType.number,
				isRequired: true,
				defaultValue: {
					name: 'index',
					type: ValueKnownType.number
				}
			})
		);

	step.property('variables').label('Extra variables').value(variableDefinitionsValueModel({}));
});
