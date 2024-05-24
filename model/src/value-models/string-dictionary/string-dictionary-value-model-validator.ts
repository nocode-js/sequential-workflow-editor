import { ValueContext } from '../../context';
import { ValidationError, ValidationResult } from '../../model';
import { StringDictionaryValueModel } from './string-dictionary-value-model';

export function stringDictionaryValueModelValidator(context: ValueContext<StringDictionaryValueModel>): ValidationResult {
	const errors: ValidationError = {};
	const value = context.getValue();
	const configuration = context.model.configuration;
	const count = value.items.length;

	if (configuration.uniqueKeys) {
		for (let index = 0; index < count; index++) {
			const key = value.items[index].key;
			const duplicate = value.items.findIndex((item, i) => i !== index && item.key === key);
			if (duplicate >= 0) {
				errors[index] = context.i18n('stringDictionary.duplicatedKey', 'Key name is duplicated');
			}
		}
	}

	for (let index = 0; index < count; index++) {
		const item = value.items[index];
		if (!item.key) {
			errors[index] = context.i18n('stringDictionary.keyIsRequired', 'Key is required');
		}
		if (configuration.valueMinLength !== undefined && item.value.length < configuration.valueMinLength) {
			errors[index] = context.i18n('stringDictionary.valueTooShort', 'Value must be at least :min characters long', {
				min: String(configuration.valueMinLength)
			});
		}
	}

	return Object.keys(errors).length > 0 ? errors : null;
}
