import { ValueModel, ValueModelFactory } from '../../model';
import { Path } from '../../core/path';
import { StringValueModelConfiguration } from './string-value-model-configuration';
import { stringValueModelValidator } from './string-value-model-validator';

export type StringValueModel = ValueModel<string, StringValueModelConfiguration>;

export const stringValueModelId = 'string';

export function stringValueModel(configuration: StringValueModelConfiguration): ValueModelFactory<StringValueModel> {
	return (path: Path) => ({
		id: stringValueModelId,
		path,
		configuration,
		getDefaultValue() {
			return configuration.defaultValue || '';
		},
		getVariableDefinitions: () => null,
		validate: stringValueModelValidator
	});
}
