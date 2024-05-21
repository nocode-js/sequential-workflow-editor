import { ValueModel, ValueModelFactoryFromModel, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { NullableAnyVariable, ValueType } from '../../types';
import { ValueContext } from '../../context';

export interface NullableAnyVariableValueModelConfiguration {
	isRequired?: boolean;
	valueTypes?: ValueType[];
}

export type NullableAnyVariableValueModel = ValueModel<NullableAnyVariable, NullableAnyVariableValueModelConfiguration>;

export const nullableAnyVariableValueModelId = 'nullableAnyVariable';

export const createNullableAnyVariableValueModel = (
	configuration: NullableAnyVariableValueModelConfiguration
): ValueModelFactoryFromModel<NullableAnyVariableValueModel> => ({
	create: (path: Path) => ({
		id: nullableAnyVariableValueModelId,
		label: 'Variable',
		path,
		configuration,
		getDefaultValue() {
			return null;
		},
		getVariableDefinitions: () => null,
		validate(context: ValueContext<NullableAnyVariableValueModel>): ValidationResult {
			const value = context.getValue();
			if (configuration.isRequired && !value) {
				return createValidationSingleError(context.i18n('nullableAnyVariable.variableIsRequired', 'The variable is required'));
			}
			if (value) {
				if (!context.hasVariable(value.name, value.type)) {
					return createValidationSingleError(
						context.i18n('nullableAnyVariable.variableIsLost', 'The variable :name is lost', { name: value.name })
					);
				}
				if (configuration.valueTypes && !configuration.valueTypes.includes(value.type)) {
					return createValidationSingleError(
						context.i18n('nullableAnyVariable.invalidVariableType', 'The variable :name has invalid type', { name: value.name })
					);
				}
			}
			return null;
		}
	})
});
