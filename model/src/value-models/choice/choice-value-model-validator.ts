import { ValueContext } from '../../context';
import { createValidationSingleError, ValidationResult } from '../../model';
import { ChoiceValueModel } from './choice-value-model';

export function choiceValueModelValidator(context: ValueContext<ChoiceValueModel>): ValidationResult {
	const value = context.getValue();
	const configuration = context.model.configuration;
	if (!configuration.choices.includes(value)) {
		return createValidationSingleError(context.i18n('choice.notSupportedValue', 'Value is not supported'));
	}
	return null;
}
