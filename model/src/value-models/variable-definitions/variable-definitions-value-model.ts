import { ValueModel, ValueModelFactory, ValidationResult } from '../../model';
import { Path } from '../../core/path';
import { VariableDefinition, VariableDefinitions } from '../../types';
import { ValueModelContext } from '../../context';
import { variableNameValidator } from '../variable-name-validator';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VariableDefinitionsValueModelConfiguration {}

export type VariableDefinitionsValueModel = ValueModel<VariableDefinitions, VariableDefinitionsValueModelConfiguration>;

export const variableDefinitionsValueModelId = 'variableDefinitions';

export function variableDefinitionsValueModel(
	configuration: VariableDefinitionsValueModelConfiguration
): ValueModelFactory<VariableDefinitionsValueModel> {
	return (path: Path) => ({
		id: variableDefinitionsValueModelId,
		label: 'Variable definitions',
		path,
		configuration,
		getDefaultValue() {
			return {
				variables: []
			};
		},
		getVariableDefinitions(context: ValueModelContext<VariableDefinitionsValueModel>): VariableDefinition[] {
			return context.getValue().variables.filter(variable => !!variable.name);
		},
		validate: (context: ValueModelContext<VariableDefinitionsValueModel>): ValidationResult => {
			const errors: Record<string, string> = {};
			const value = context.getValue();

			value.variables.forEach((variable, index) => {
				const nameError = variableNameValidator(variable.name);
				if (nameError) {
					errors[index] = nameError;
					return;
				}
				const isDuplicated = value.variables.some((v, i) => i !== index && v.name === variable.name);
				if (isDuplicated) {
					errors[index] = 'Variable name is duplicated';
					return;
				}
				if (context.isVariableDuplicated(variable.name)) {
					errors[index] = 'Variable name is already used';
					return;
				}
			});

			return Object.keys(errors).length > 0 ? errors : null;
		}
	});
}
