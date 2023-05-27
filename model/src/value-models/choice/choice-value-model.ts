import { ValueModel, ValueModelFactory, ValidationResult, createValidationSingleError } from '../../model';
import { Path } from '../../core/path';
import { ValueModelContext } from '../../context';

export interface ChoiceValueModelConfiguration {
	choices: string[];
	defaultValue?: string;
}

export type ChoiceValueModel = ValueModel<string, ChoiceValueModelConfiguration>;

export const choiceValueModelId = 'choice';

export function choiceValueModel(configuration: ChoiceValueModelConfiguration): ValueModelFactory<ChoiceValueModel> {
	if (configuration.choices.length < 1) {
		throw new Error('At least one choice must be provided.');
	}

	return (path: Path) => ({
		id: choiceValueModelId,
		path,
		configuration,
		getDefaultValue() {
			if (configuration.defaultValue) {
				if (!configuration.choices.includes(configuration.defaultValue)) {
					throw new Error('Default value does not match any of the choices.');
				}
				return configuration.defaultValue;
			}
			return configuration.choices[0];
		},
		getVariableDefinitions: () => null,
		validate(context: ValueModelContext<ChoiceValueModel>): ValidationResult {
			const value = context.getValue();
			if (!configuration.choices.includes(value)) {
				return createValidationSingleError('Choice is not supported.');
			}
			return null;
		}
	});
}
