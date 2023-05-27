import { ValueModelContext } from '../../context';
import { ValidationSingleError } from '../../model';
import { StringValueModel } from './string-value-model';
import { StringValueModelConfiguration } from './string-value-model-configuration';
import { stringValueModelValidator } from './string-value-model-validator';

describe('stringValueModelValidator', () => {
	function getContext(value: string, configuration: StringValueModelConfiguration) {
		return {
			getValue: () => value,
			model: {
				configuration
			}
		} as unknown as ValueModelContext<StringValueModel>;
	}

	it('returns correct response when minLength is set', () => {
		const configuration = {
			minLength: 2
		};

		const context1 = getContext('', configuration);
		const error1 = stringValueModelValidator(context1) as ValidationSingleError;
		expect(error1.$).toBe('The value must be at least 2 characters long.');

		const context2 = getContext('fo', configuration);
		const error2 = stringValueModelValidator(context2);
		expect(error2).toBe(null);
	});

	it('returns correct response when pattern is set', () => {
		const configuration = {
			pattern: /^[a-z]$/
		};

		const context1 = getContext('1', configuration);
		const error1 = stringValueModelValidator(context1) as ValidationSingleError;
		expect(error1.$).toBe('The value does not match the required pattern.');

		const context2 = getContext('a', configuration);
		const error2 = stringValueModelValidator(context2);
		expect(error2).toBe(null);
	});

	it('returns success if configuration does not have restrictions', () => {
		for (const text of ['', 'a', 'ab']) {
			const context = getContext(text, {});
			const error = stringValueModelValidator(context);
			expect(error).toBe(null);
		}
	});
});
