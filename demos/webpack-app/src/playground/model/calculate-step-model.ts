import { formatVariableName } from 'sequential-workflow-editor';
import {
	Dynamic,
	NullableVariable,
	ValueKnownType,
	choiceValueModel,
	createStepModel,
	dynamicValueModel,
	generatedStringValueModel,
	nullableVariableValueModel,
	numberValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface CalculateStep extends Step {
	type: 'calculate';
	componentType: 'task';
	properties: {
		a: Dynamic<number | NullableVariable>;
		operator: string;
		b: Dynamic<number | NullableVariable>;
		result: NullableVariable;
	};
}

export const calculateStepModel = createStepModel<CalculateStep>('calculate', 'task', step => {
	step.category('Values');
	step.description('Calculate value from two numbers. Result is stored in variable.');

	step.name()
		.value(
			generatedStringValueModel({
				generator: context => {
					const result = context.formatPropertyValue('result', value => formatVariableName(value.name));
					const a = context.formatPropertyValue('a', ({ value }) => {
						return value && typeof value === 'object' ? formatVariableName(value.name) : String(value ?? '?');
					});
					const operator = context.getPropertyValue('operator');
					const b = context.formatPropertyValue('b', ({ value }) => {
						return value && typeof value === 'object' ? formatVariableName(value.name) : String(value ?? '?');
					});
					return `${result} = ${a} ${operator} ${b}`;
				}
			})
		)
		.dependentProperty('result')
		.dependentProperty('a')
		.dependentProperty('b')
		.dependentProperty('operator');

	const val = dynamicValueModel({
		models: [
			numberValueModel({}),
			nullableVariableValueModel({
				isRequired: true,
				valueType: ValueKnownType.number
			})
		]
	});

	step.property('result').value(
		nullableVariableValueModel({
			valueType: ValueKnownType.number,
			isRequired: true
		})
	);

	step.property('a').value(val).label('A');

	step.property('operator').value(
		choiceValueModel({
			choices: ['+', '-', '*', '/', '%']
		})
	);

	step.property('b').value(val).label('B');
});
