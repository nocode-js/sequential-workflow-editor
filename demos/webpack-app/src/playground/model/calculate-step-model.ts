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
