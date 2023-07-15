import { ValueContext } from '../../context';
import { ValidationResult, createValidationSingleError } from '../../model';
import { StringValueModel } from './string-value-model';

export function stringValueModelValidator(context: ValueContext<StringValueModel>): ValidationResult {
	const value = context.getValue();
	const configuration = context.model.configuration;

	if (typeof value !== 'string') {
		return createValidationSingleError('The value must be a string.');
	}
	if (configuration.minLength !== undefined && value.length < configuration.minLength) {
		return createValidationSingleError(`The value must be at least ${configuration.minLength} characters long.`);
	}
	if (configuration.pattern && !configuration.pattern.test(value)) {
		return createValidationSingleError('The value does not match the required pattern.');
	}
	return null;
}
