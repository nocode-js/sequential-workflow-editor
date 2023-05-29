import {
	Dynamic,
	NullableVariable,
	ValueKnownType,
	choiceValueModel,
	createStepModel,
	dynamicValueModel,
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
	const val = dynamicValueModel({
		choices: [
			numberValueModel({}),
			nullableVariableValueModel({
				isRequired: true,
				variableType: ValueKnownType.number
			})
		]
	});

	step.property('a').value(val).label('A');

	step.property('operator').value(
		choiceValueModel({
			choices: ['+', '-', '*', '/', '%']
		})
	);

	step.property('b').value(val).label('B');

	step.property('result').value(
		nullableVariableValueModel({
			variableType: ValueKnownType.number,
			isRequired: true
		})
	);
});
