import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { NumberValueModelConfiguration } from './number-value-model-configuration';
import { numberValueModelValidator } from './number-value-model-validator';

export type NumberValueModel = ValueModel<number, NumberValueModelConfiguration>;

export const numberValueModelId = 'number';

export const createNumberValueModel = (configuration: NumberValueModelConfiguration): ValueModelFactoryFromModel<NumberValueModel> => ({
	create: (path: Path) => ({
		id: numberValueModelId,
		label: configuration.label ?? 'Number',
		editorId: configuration.editorId,
		path,
		configuration,
		getDefaultValue() {
			if (configuration.defaultValue !== undefined) {
				return configuration.defaultValue;
			}
			if (configuration.min !== undefined) {
				return configuration.min;
			}
			return 0;
		},
		getVariableDefinitions: () => null,
		validate: numberValueModelValidator
	})
});
