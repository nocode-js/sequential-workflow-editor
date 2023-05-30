import { ValueModel, ValueModelFactory, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { NullableVariableDefinition, ValueType, VariableDefinition } from '../../types';
import { ValueModelContext } from '../../context';
import { variableNameValidator } from '../variable-name-validator';

export interface NullableVariableDefinitionValueModelConfiguration {
	variableType: ValueType;
	isRequired?: boolean;
	defaultValue?: VariableDefinition;
}

export type NullableVariableDefinitionValueModel = ValueModel<
	NullableVariableDefinition,
	NullableVariableDefinitionValueModelConfiguration
>;

export const nullableVariableDefinitionValueModelId = 'nullableVariableDefinition';

export function nullableVariableDefinitionValueModel(
	configuration: NullableVariableDefinitionValueModelConfiguration
): ValueModelFactory<NullableVariableDefinitionValueModel> {
	return (path: Path) => ({
		id: nullableVariableDefinitionValueModelId,
		label: 'Variable definition',
		path,
		configuration,
		getDefaultValue() {
			return configuration.defaultValue || null;
		},
		getVariableDefinitions(context: ValueModelContext<NullableVariableDefinitionValueModel>): VariableDefinition[] | null {
			const value = context.getValue();
			if (value) {
				return [value];
			}
			return null;
		},
		validate(context: ValueModelContext<NullableVariableDefinitionValueModel>): ValidationResult {
			const value = context.getValue();
			if (configuration.isRequired && !value) {
				return createValidationSingleError('Variable name is required.');
			}
			if (value) {
				const nameError = variableNameValidator(value.name);
				if (nameError) {
					return createValidationSingleError(nameError);
				}
				if (value.type !== configuration.variableType) {
					return createValidationSingleError(`Variable type must be ${configuration.variableType}.`);
				}
				if (context.isVariableDuplicated(value.name)) {
					return createValidationSingleError('Variable name is already used.');
				}
			}
			return null;
		}
	});
}
