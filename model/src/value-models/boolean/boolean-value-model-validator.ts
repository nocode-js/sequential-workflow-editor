import { ValueContext } from '../../context';
import { ValidationResult, createValidationSingleError } from '../../model';
import { BooleanValueModel } from './boolean-value-model';

export function booleanValueModelValidator(context: ValueContext<BooleanValueModel>): ValidationResult {
	const value = context.getValue();
	if (typeof value !== 'boolean') {
		return createValidationSingleError('The value must be a boolean.');
	}
	return null;
}
