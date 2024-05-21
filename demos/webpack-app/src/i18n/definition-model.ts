import {
	StringDictionary,
	createBooleanValueModel,
	createDefinitionModel,
	createNumberValueModel,
	createStepModel,
	createStringDictionaryValueModel
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
		users: StringDictionary;
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
			step.property('users').value(
				createStringDictionaryValueModel({
					valueMinLength: 1,
					uniqueKeys: true
				})
			);
		})
	]);
});
