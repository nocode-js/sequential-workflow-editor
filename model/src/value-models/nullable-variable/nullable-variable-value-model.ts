import { ValueModel, ValueModelFactoryFromModel, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { NullableVariable } from '../../types';
import { ValueType } from '../../types';
import { ValueContext } from '../../context';

export interface NullableVariableValueModelConfiguration {
	label?: string;
	valueType: ValueType;
	isRequired?: boolean;
	editorId?: string;
}

export type NullableVariableValueModel = ValueModel<NullableVariable, NullableVariableValueModelConfiguration>;

export const nullableVariableValueModelId = 'nullableVariable';

export const createNullableVariableValueModel = (
	configuration: NullableVariableValueModelConfiguration
): ValueModelFactoryFromModel<NullableVariableValueModel> => ({
	create: (path: Path) => ({
		id: nullableVariableValueModelId,
		label: configuration.label ?? 'Variable',
		editorId: configuration.editorId,
		path,
		configuration,
		getDefaultValue(): NullableVariable {
			return null;
		},
		getVariableDefinitions: () => null,
		validate(context: ValueContext<NullableVariableValueModel>): ValidationResult {
			const value = context.getValue();
			if (configuration.isRequired && !value) {
				return createValidationSingleError(context.i18n('nullableVariable.variableIsRequired', 'The variable is required'));
			}
			if (value && value.name) {
				if (!context.hasVariable(value.name, configuration.valueType)) {
					return createValidationSingleError(
						context.i18n('nullableVariable.variableIsLost', 'The variable :name is not found', {
							name: value.name
						})
					);
				}
			}
			return null;
		}
	})
});
