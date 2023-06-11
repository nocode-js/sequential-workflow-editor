import { ValueModel, ValueModelFactory, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { NullableAnyVariable, ValueType } from '../../types';
import { ValueModelContext } from '../../context';

export interface NullableAnyVariableValueModelConfiguration {
	isRequired?: boolean;
	valueTypes?: ValueType[];
}

export type NullableAnyVariableValueModel = ValueModel<NullableAnyVariable, NullableAnyVariableValueModelConfiguration>;

export const nullableAnyVariableValueModelId = 'nullableAnyVariable';

export function nullableAnyVariableValueModel(
	configuration: NullableAnyVariableValueModelConfiguration
): ValueModelFactory<NullableAnyVariableValueModel> {
	return (path: Path) => ({
		id: nullableAnyVariableValueModelId,
		label: 'Variable',
		path,
		configuration,
		getDefaultValue() {
			return null;
		},
		getVariableDefinitions: () => null,
		validate(context: ValueModelContext<NullableAnyVariableValueModel>): ValidationResult {
			const value = context.getValue();
			if (configuration.isRequired && !value) {
				return createValidationSingleError(`The variable is required.`);
			}
			if (value) {
				if (!context.hasVariable(value.name, value.type)) {
					return createValidationSingleError(`The variable ${value.name} is lost`);
				}
				if (configuration.valueTypes && !configuration.valueTypes.includes(value.type)) {
					return createValidationSingleError(`The variable ${value.name} has invalid type`);
				}
			}
			return null;
		}
	});
}
