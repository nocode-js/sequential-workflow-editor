import { ValueModel, ValidationResult, createValidationSingleError, ValueModelFactory } from '../../model';
import { Path } from '../../core/path';
import { ValueContext } from '../../context';

export interface ChoiceValueModelConfiguration<TValue extends string = string> {
	label?: string;
	choices: TValue[];
	defaultValue?: TValue;
	editorId?: string;
}

export type ChoiceValueModel<TValue extends string = string> = ValueModel<TValue, ChoiceValueModelConfiguration<TValue>>;

export const choiceValueModelId = 'choice';

export function createChoiceValueModel<TValue extends string>(
	configuration: ChoiceValueModelConfiguration<TValue>
): ValueModelFactory<TValue, ChoiceValueModelConfiguration<TValue>> {
	if (configuration.choices.length < 1) {
		throw new Error('At least one choice must be provided.');
	}

	return {
		create: (path: Path) => ({
			id: choiceValueModelId,
			label: configuration.label ?? 'Choice',
			editorId: configuration.editorId,
			path,
			configuration,
			getDefaultValue() {
				if (configuration.defaultValue) {
					if (!configuration.choices.includes(configuration.defaultValue)) {
						throw new Error(`Default value "${configuration.defaultValue}" does not match any of the choices`);
					}
					return configuration.defaultValue;
				}
				return configuration.choices[0];
			},
			getVariableDefinitions: () => null,
			validate(context: ValueContext<ChoiceValueModel<TValue>>): ValidationResult {
				const value = context.getValue();
				if (!configuration.choices.includes(value)) {
					return createValidationSingleError(context.i18n('choice.notSupportedValue', 'Value is not supported'));
				}
				return null;
			}
		})
	};
}
