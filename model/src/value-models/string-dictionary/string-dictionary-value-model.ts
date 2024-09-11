import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { StringDictionary } from '../../types';
import { StringDictionaryValueModelConfiguration } from './string-dictionary-value-model-configuration';
import { stringDictionaryValueModelValidator } from './string-dictionary-value-model-validator';

export type StringDictionaryValueModel = ValueModel<StringDictionary, StringDictionaryValueModelConfiguration>;

export const stringDictionaryValueModelId = 'stringDictionary';

export const createStringDictionaryValueModel = (
	configuration: StringDictionaryValueModelConfiguration
): ValueModelFactoryFromModel<StringDictionaryValueModel> => ({
	create: (path: Path) => ({
		id: stringDictionaryValueModelId,
		label: configuration.label ?? 'Dictionary',
		editorId: configuration.editorId,
		path,
		configuration,
		getDefaultValue() {
			return {
				items: []
			};
		},
		getVariableDefinitions: () => null,
		validate: stringDictionaryValueModelValidator
	})
});
