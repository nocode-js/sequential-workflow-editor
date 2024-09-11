import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { StringValueModelConfiguration } from './string-value-model-configuration';
import { stringValueModelValidator } from './string-value-model-validator';

export type StringValueModel = ValueModel<string, StringValueModelConfiguration>;

export const stringValueModelId = 'string';

export const createStringValueModel = (configuration: StringValueModelConfiguration): ValueModelFactoryFromModel<StringValueModel> => ({
	create: (path: Path) => ({
		id: stringValueModelId,
		label: configuration.label ?? 'String',
		editorId: configuration.editorId,
		path,
		configuration,
		getDefaultValue() {
			return configuration.defaultValue || '';
		},
		getVariableDefinitions: () => null,
		validate: stringValueModelValidator
	})
});
