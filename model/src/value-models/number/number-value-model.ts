import { ValueModel, ValueModelFactory, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { ValueModelContext } from '../../context';

export interface NumberValueModelConfiguration {
	defaultValue?: number;
	min?: number;
	max?: number;
}

export type NumberValueModel = ValueModel<number, NumberValueModelConfiguration>;

export const numberValueModelId = 'number';

export function numberValueModel(configuration: NumberValueModelConfiguration): ValueModelFactory<NumberValueModel> {
	return (path: Path) => ({
		id: numberValueModelId,
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
		validate(context: ValueModelContext<NumberValueModel>): ValidationResult {
			const value = context.getValue();
			if (isNaN(value)) {
				return createValidationSingleError('The value must be a number.');
			}
			if (configuration.min !== undefined && value < configuration.min) {
				return createValidationSingleError(`The value must be at least ${configuration.min}.`);
			}
			if (configuration.max !== undefined && value > configuration.max) {
				return createValidationSingleError(`The value must be at most ${configuration.max}.`);
			}
			return null;
		}
	});
}
