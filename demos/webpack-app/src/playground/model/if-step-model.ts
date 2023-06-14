import {
	Dynamic,
	NullableVariable,
	booleanValueModel,
	branchesValueModel,
	choiceValueModel,
	createBranchedStepModel,
	dynamicValueModel,
	nullableAnyVariableValueModel,
	numberValueModel,
	stringValueModel
} from 'sequential-workflow-editor-model';
import { BranchedStep } from 'sequential-workflow-model';

export interface IfStep extends BranchedStep {
	type: 'if';
	componentType: 'switch';
	properties: {
		a: Dynamic<number | string | boolean | NullableVariable>;
		operator: string;
		b: Dynamic<number | string | boolean | NullableVariable>;
	};
}

export const ifStepModel = createBranchedStepModel<IfStep>('if', 'switch', step => {
	step.category('Logic');
	step.description('Check condition and execute different branches.');

	const ab = dynamicValueModel({
		models: [
			numberValueModel({}),
			stringValueModel({}),
			booleanValueModel({}),
			nullableAnyVariableValueModel({
				isRequired: true
			})
		]
	});

	step.property('a').value(ab).label('A').hint('Left side of comparison.');

	step.property('operator')
		.label('Operator')
		.value(
			choiceValueModel({
				choices: ['==', '===', '!=', '!==', '>', '>=', '<', '<=']
			})
		)
		.hint('Comparison operator.\nStep supports strict and non-strict operators.');

	step.property('b').value(ab).label('B').hint('Right side of comparison.');

	step.branches().value(
		branchesValueModel({
			branches: {
				true: [],
				false: []
			}
		})
	);
});
