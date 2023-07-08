import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { StringDictionary } from '../../types';
import { StringDictionaryValueModelConfiguration } from './string-dictionary-value-model-configuration';
import { stringDictionaryValueModelValidator } from './string-dictionary-value-model-validator';

export type StringDictionaryValueModel = ValueModel<StringDictionary, StringDictionaryValueModelConfiguration>;

export const stringDictionaryValueModelId = 'stringDictionary';

export const stringDictionaryValueModel = (
	configuration: StringDictionaryValueModelConfiguration
): ValueModelFactoryFromModel<StringDictionaryValueModel> => ({
	create: (path: Path) => ({
		id: stringDictionaryValueModelId,
		label: 'Dictionary',
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
