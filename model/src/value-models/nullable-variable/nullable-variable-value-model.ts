import { ValueModel, ValueModelFactory, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { NullableVariable } from '../../types';
import { ValueType } from '../../types';
import { ValueModelContext } from '../../context';

export interface NullableVariableValueModelConfiguration {
	variableType: ValueType;
	isRequired?: boolean;
}

export type NullableVariableValueModel = ValueModel<NullableVariable, NullableVariableValueModelConfiguration>;

export const nullableVariableValueModelId = 'nullableVariable';

export function nullableVariableValueModel(
	configuration: NullableVariableValueModelConfiguration
): ValueModelFactory<NullableVariableValueModel> {
	return (path: Path) => ({
		id: nullableVariableValueModelId,
		label: 'Variable',
		path,
		configuration,
		getDefaultValue(): NullableVariable {
			return null;
		},
		getVariableDefinitions: () => null,
		validate(context: ValueModelContext<NullableVariableValueModel>): ValidationResult {
			const value = context.getValue();
			if (configuration.isRequired && !value) {
				return createValidationSingleError(`The variable is required.`);
			}
			if (value && value.name) {
				if (!context.hasVariable(value.name, configuration.variableType)) {
					return createValidationSingleError(`The variable ${value.name} is not found.`);
				}
			}
			return null;
		}
	});
}
