import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { BooleanValueModelConfiguration } from './boolean-value-model-configuration';
import { booleanValueModelValidator } from './boolean-value-model-validator';

export type BooleanValueModel = ValueModel<boolean, BooleanValueModelConfiguration>;

export const booleanValueModelId = 'boolean';

export const createBooleanValueModel = (configuration: BooleanValueModelConfiguration): ValueModelFactoryFromModel<BooleanValueModel> => ({
	create: (path: Path) => ({
		id: booleanValueModelId,
		editorId: configuration.editorId,
		label: configuration.label ?? 'Boolean',
		path,
		configuration,
		getDefaultValue() {
			if (configuration.defaultValue !== undefined) {
				return configuration.defaultValue;
			}
			return false;
		},
		getVariableDefinitions: () => null,
		validate: booleanValueModelValidator
	})
});
