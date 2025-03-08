import {
	Dynamic,
	StringDictionary,
	createBooleanValueModel,
	createChoiceValueModel,
	createDefinitionModel,
	createDynamicValueModel,
	createNumberValueModel,
	createStepModel,
	createStringDictionaryValueModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { Definition, Step } from 'sequential-workflow-model';

export interface I18nDefinition extends Definition {
	properties: {
		timeout: number;
		debug: boolean;
	};
}

export interface ChownStep extends Step {
	type: 'chown';
	componentType: 'task';
	properties: {
		stringOrNumber: Dynamic<string | number>;
		users: StringDictionary;
		mode: string;
	};
}

export const definitionModel = createDefinitionModel<I18nDefinition>(model => {
	model.root(root => {
		root.property('timeout').value(
			createNumberValueModel({
				min: 100,
				max: 200,
				defaultValue: 150
			})
		);
		root.property('debug').value(
			createBooleanValueModel({
				defaultValue: false
			})
		);
	});
	model.steps([
		createStepModel<ChownStep>('chown', 'task', step => {
			step.property('stringOrNumber').value(
				createDynamicValueModel({
					models: [
						createStringValueModel({
							pattern: /^[a-zA-Z0-9]+$/
						}),
						createNumberValueModel({
							min: 1,
							max: 100,
							defaultValue: 50
						})
					]
				})
			);
			step.property('users').value(
				createStringDictionaryValueModel({
					valueMinLength: 1,
					uniqueKeys: true
				})
			);
			step.property('mode').value(
				createChoiceValueModel({
					choices: ['Read', 'Write', 'Execute'],
					defaultValue: 'Read'
				})
			);
		})
	]);
});
