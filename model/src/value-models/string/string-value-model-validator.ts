import { ValueContext } from '../../context';
import { ValidationResult, createValidationSingleError } from '../../model';
import { StringValueModel } from './string-value-model';

export function stringValueModelValidator(context: ValueContext<StringValueModel>): ValidationResult {
	const value = context.getValue();
	const configuration = context.model.configuration;

	if (typeof value !== 'string') {
		return createValidationSingleError(context.i18n('string.valueMustBeString', 'The value must be a string'));
	}
	if (configuration.minLength !== undefined && value.length < configuration.minLength) {
		return createValidationSingleError(
			context.i18n('string.valueTooShort', 'The value must be at least :min characters long', {
				min: String(configuration.minLength)
			})
		);
	}
	if (configuration.pattern && !configuration.pattern.test(value)) {
		return createValidationSingleError(
			context.i18n('string.valueDoesNotMatchPattern', 'The value does not match the required pattern')
		);
	}
	return null;
}
