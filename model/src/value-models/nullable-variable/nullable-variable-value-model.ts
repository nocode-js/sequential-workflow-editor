import { ValueModel, ValueModelFactoryFromModel, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { NullableVariable } from '../../types';
import { ValueType } from '../../types';
import { ValueContext } from '../../context';

export interface NullableVariableValueModelConfiguration {
	valueType: ValueType;
	isRequired?: boolean;
}

export type NullableVariableValueModel = ValueModel<NullableVariable, NullableVariableValueModelConfiguration>;

export const nullableVariableValueModelId = 'nullableVariable';

export const nullableVariableValueModel = (
	configuration: NullableVariableValueModelConfiguration
): ValueModelFactoryFromModel<NullableVariableValueModel> => ({
	create: (path: Path) => ({
		id: nullableVariableValueModelId,
		label: 'Variable',
		path,
		configuration,
		getDefaultValue(): NullableVariable {
			return null;
		},
		getVariableDefinitions: () => null,
		validate(context: ValueContext<NullableVariableValueModel>): ValidationResult {
			const value = context.getValue();
			if (configuration.isRequired && !value) {
				return createValidationSingleError(`The variable is required.`);
			}
			if (value && value.name) {
				if (!context.hasVariable(value.name, configuration.valueType)) {
					return createValidationSingleError(`The variable ${value.name} is not found.`);
				}
			}
			return null;
		}
	})
});
