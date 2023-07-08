import { StringDictionary, createStepModel, stringDictionaryValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface StringDictionaryStepModel extends Step {
	type: 'stringDictionary';
	componentType: 'task';
	properties: {
		zeroConfig: StringDictionary;
		uniqueKeys: StringDictionary;
		valueMinLength3: StringDictionary;
	};
}

export const stringDictionaryStepModel = createStepModel<StringDictionaryStepModel>('stringDictionary', 'task', step => {
	step.property('zeroConfig').value(stringDictionaryValueModel({}));
	step.property('uniqueKeys').value(
		stringDictionaryValueModel({
			uniqueKeys: true
		})
	);
	step.property('valueMinLength3').value(
		stringDictionaryValueModel({
			valueMinLength: 3
		})
	);
});
