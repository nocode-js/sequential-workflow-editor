import {
	Dynamic,
	NullableVariable,
	ValueKnownType,
	branchesValueModel,
	choiceValueModel,
	createBranchedStepModel,
	dynamicValueModel,
	nullableVariableValueModel,
	numberValueModel
} from 'sequential-workflow-editor-model';
import { BranchedStep } from 'sequential-workflow-model';

export interface IfStep extends BranchedStep {
	type: 'if';
	componentType: 'switch';
	properties: {
		a: Dynamic<number | NullableVariable>;
		operator: string;
		b: Dynamic<number | NullableVariable>;
	};
}

export const ifStepModel = createBranchedStepModel<IfStep>('if', 'switch', step => {
	const val = dynamicValueModel({
		models: [
			numberValueModel({}),
			nullableVariableValueModel({
				isRequired: true,
				valueType: ValueKnownType.number
			})
		]
	});

	step.property('a').value(val).label('A');

	step.property('operator')
		.label('Operator')
		.value(
			choiceValueModel({
				choices: ['=', '!=', '>', '>=', '<', '<=']
			})
		);

	step.property('b').value(val).label('B');

	step.branches().value(
		branchesValueModel({
			branches: {
				true: [],
				false: []
			}
		})
	);
});
