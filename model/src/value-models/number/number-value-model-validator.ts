import { ValueContext } from '../../context';
import { ValidationResult, createValidationSingleError } from '../../model';
import { NumberValueModel } from './number-value-model';

export function numberValueModelValidator(context: ValueContext<NumberValueModel>): ValidationResult {
	const value = context.getValue();
	const configuration = context.model.configuration;

	if (isNaN(value) || typeof value !== 'number') {
		return createValidationSingleError('The value must be a number.');
	}
	if (configuration.min !== undefined && value < configuration.min) {
		return createValidationSingleError(`The value must be at least ${configuration.min}.`);
	}
	if (configuration.max !== undefined && value > configuration.max) {
		return createValidationSingleError(`The value must be at most ${configuration.max}.`);
	}
	return null;
}
