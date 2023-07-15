import { StringDictionary, createStepModel, createStringDictionaryValueModel } from 'sequential-workflow-editor-model';
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
	step.property('zeroConfig').value(createStringDictionaryValueModel({}));
	step.property('uniqueKeys').value(
		createStringDictionaryValueModel({
			uniqueKeys: true
		})
	);
	step.property('valueMinLength3').value(
		createStringDictionaryValueModel({
			valueMinLength: 3
		})
	);
});
