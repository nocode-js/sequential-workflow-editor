import { ValueModel, ValueModelFactoryFromModel, ValidationResult, ValidationError } from '../../model';
import { Path } from '../../core/path';
import { ValueType, VariableDefinition, VariableDefinitions } from '../../types';
import { ValueContext } from '../../context';
import { variableNameValidator } from '../../validator/variable-name-validator';

export interface VariableDefinitionsValueModelConfiguration {
	valueTypes?: ValueType[];
	defaultValue?: VariableDefinitions;
}

export type VariableDefinitionsValueModel = ValueModel<VariableDefinitions, VariableDefinitionsValueModelConfiguration>;

export const variableDefinitionsValueModelId = 'variableDefinitions';

export const createVariableDefinitionsValueModel = (
	configuration: VariableDefinitionsValueModelConfiguration
): ValueModelFactoryFromModel<VariableDefinitionsValueModel> => ({
	create: (path: Path) => ({
		id: variableDefinitionsValueModelId,
		label: 'Variable definitions',
		path,
		configuration,
		getDefaultValue() {
			return (
				configuration.defaultValue ?? {
					variables: []
				}
			);
		},
		getVariableDefinitions(context: ValueContext<VariableDefinitionsValueModel>): VariableDefinition[] {
			return context.getValue().variables.filter(variable => !!variable.name);
		},
		validate: (context: ValueContext<VariableDefinitionsValueModel>): ValidationResult => {
			const errors: ValidationError = {};
			const value = context.getValue();

			value.variables.forEach((variable, index) => {
				const nameError = variableNameValidator(context.i18n, variable.name);
				if (nameError) {
					errors[index] = nameError;
					return;
				}
				const isDuplicated = value.variables.some((v, i) => i !== index && v.name === variable.name);
				if (isDuplicated) {
					errors[index] = context.i18n('variableDefinitions.variableNameIsDuplicated', 'Variable name is duplicated');
					return;
				}
				if (context.isVariableDuplicated(variable.name)) {
					errors[index] = context.i18n('variableDefinitions.variableNameIsDuplicated', 'Variable name is already used');
					return;
				}
				if (configuration.valueTypes && !configuration.valueTypes.includes(variable.type)) {
					errors[index] = context.i18n('variableDefinitions.valueTypeIsNotAllowed', 'Value type is not allowed');
				}
			});

			return Object.keys(errors).length > 0 ? errors : null;
		}
	})
});
