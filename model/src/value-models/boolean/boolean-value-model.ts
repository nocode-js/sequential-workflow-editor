import { ValueModel, ValueModelFactory } from '../../model';
import { Path } from '../../core/path';
import { BooleanValueModelConfiguration } from './boolean-value-model-configuration';

export type BooleanValueModel = ValueModel<boolean, BooleanValueModelConfiguration>;

export const booleanValueModelId = 'boolean';

export function booleanValueModel(configuration: BooleanValueModelConfiguration): ValueModelFactory<BooleanValueModel> {
	return (path: Path) => ({
		id: booleanValueModelId,
		label: 'Boolean',
		path,
		configuration,
		getDefaultValue() {
			if (configuration.defaultValue !== undefined) {
				return configuration.defaultValue;
			}
			return false;
		},
		getVariableDefinitions: () => null,
		validate: () => null
	});
}
