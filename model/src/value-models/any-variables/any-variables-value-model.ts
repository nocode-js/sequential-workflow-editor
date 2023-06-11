import { ValueModel, ValueModelFactory, ValidationResult } from '../../model';
import { Path } from '../../core/path';
import { AnyVariables, ValueType } from '../../types';
import { ValueModelContext } from '../../context';

export interface AnyVariablesValueModelConfiguration {
	valueTypes?: ValueType[];
}

export type AnyVariablesValueModel = ValueModel<AnyVariables, AnyVariablesValueModelConfiguration>;

export const anyVariablesValueModelId = 'anyVariables';

export function anyVariablesValueModel(configuration: AnyVariablesValueModelConfiguration): ValueModelFactory<AnyVariablesValueModel> {
	return (path: Path) => ({
		id: anyVariablesValueModelId,
		label: 'Variables',
		path,
		configuration,
		getDefaultValue() {
			return {
				variables: []
			};
		},
		getVariableDefinitions: () => null,
		validate(context: ValueModelContext<AnyVariablesValueModel>): ValidationResult {
			const errors: Record<string, string> = {};
			const value = context.getValue();

			value.variables.forEach((variable, index) => {
				if (!context.hasVariable(variable.name, variable.type)) {
					errors[index] = `Variable ${variable.name} is lost`;
					return;
				}
				if (configuration.valueTypes && !configuration.valueTypes.includes(variable.type)) {
					errors[index] = `Variable ${variable.name} has invalid type`;
					return;
				}
			});

			return Object.keys(errors).length > 0 ? errors : null;
		}
	});
}
