import {
	Dynamic,
	NullableVariable,
	createBooleanValueModel,
	createBranchesValueModel,
	createChoiceValueModel,
	createBranchedStepModel,
	createDynamicValueModel,
	createNullableAnyVariableValueModel,
	createNumberValueModel,
	createStringValueModel
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

	const ab = createDynamicValueModel({
		models: [
			createNumberValueModel({}),
			createStringValueModel({}),
			createBooleanValueModel({}),
			createNullableAnyVariableValueModel({
				isRequired: true
			})
		]
	});

	step.property('a').value(ab).label('A').hint('Left side of comparison.');

	step.property('operator')
		.label('Operator')
		.value(
			createChoiceValueModel({
				choices: ['==', '===', '!=', '!==', '>', '>=', '<', '<=']
			})
		)
		.hint('Comparison operator.\nStep supports strict and non-strict operators.');

	step.property('b').value(ab).label('B').hint('Right side of comparison.');

	step.branches().value(
		createBranchesValueModel({
			branches: {
				true: [],
				false: []
			}
		})
	);
});
