import { ValueModel, ValueModelFactoryFromModel, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { NullableVariableDefinition, ValueType, VariableDefinition } from '../../types';
import { ValueContext } from '../../context';
import { variableNameValidator } from '../../validator/variable-name-validator';

export interface NullableVariableDefinitionValueModelConfiguration {
	valueType: ValueType;
	isRequired?: boolean;
	defaultValue?: VariableDefinition;
}

export type NullableVariableDefinitionValueModel = ValueModel<
	NullableVariableDefinition,
	NullableVariableDefinitionValueModelConfiguration
>;

export const nullableVariableDefinitionValueModelId = 'nullableVariableDefinition';

export const createNullableVariableDefinitionValueModel = (
	configuration: NullableVariableDefinitionValueModelConfiguration
): ValueModelFactoryFromModel<NullableVariableDefinitionValueModel> => ({
	create: (path: Path) => ({
		id: nullableVariableDefinitionValueModelId,
		label: 'Variable definition',
		path,
		configuration,
		getDefaultValue() {
			return configuration.defaultValue || null;
		},
		getVariableDefinitions(context: ValueContext<NullableVariableDefinitionValueModel>): VariableDefinition[] | null {
			const value = context.getValue();
			if (value) {
				return [value];
			}
			return null;
		},
		validate(context: ValueContext<NullableVariableDefinitionValueModel>): ValidationResult {
			const value = context.getValue();
			if (configuration.isRequired && !value) {
				return createValidationSingleError('Variable name is required.');
			}
			if (value) {
				const nameError = variableNameValidator(value.name);
				if (nameError) {
					return createValidationSingleError(nameError);
				}
				if (value.type !== configuration.valueType) {
					return createValidationSingleError(`Variable type must be ${configuration.valueType}.`);
				}
				if (context.isVariableDuplicated(value.name)) {
					return createValidationSingleError('Variable name is already used.');
				}
			}
			return null;
		}
	})
});
