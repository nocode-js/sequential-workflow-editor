import { createValueContextStub } from '../../test-tools/value-context-stub';
import { StringValueModel } from './string-value-model';
import { StringValueModelConfiguration } from './string-value-model-configuration';
import { stringValueModelValidator } from './string-value-model-validator';

describe('stringValueModelValidator', () => {
	it('returns correct response when minLength is set', () => {
		const configuration: StringValueModelConfiguration = {
			minLength: 2
		};

		const context1 = createValueContextStub<StringValueModel>('', configuration);
		const error1 = stringValueModelValidator(context1);
		expect(error1?.$).toBe('The value must be at least 2 characters long');

		const context2 = createValueContextStub<StringValueModel>('fo', configuration);
		const error2 = stringValueModelValidator(context2);
		expect(error2).toBe(null);
	});

	it('returns error when value is not string', () => {
		const context1 = createValueContextStub<StringValueModel>(0x123, {});
		const error1 = stringValueModelValidator(context1);
		expect(error1?.$).toBe('The value must be a string');
	});

	it('returns correct response when pattern is set', () => {
		const configuration: StringValueModelConfiguration = {
			pattern: /^[a-z]$/
		};

		const context1 = createValueContextStub<StringValueModel>('1', configuration);
		const error1 = stringValueModelValidator(context1);
		expect(error1?.$).toBe('The value does not match the required pattern');

		const context2 = createValueContextStub<StringValueModel>('a', configuration);
		const error2 = stringValueModelValidator(context2);
		expect(error2).toBe(null);
	});

	it('returns success if configuration does not have restrictions', () => {
		for (const text of ['', 'a', 'ab']) {
			const context = createValueContextStub<StringValueModel>(text, {});
			const error = stringValueModelValidator(context);
			expect(error).toBe(null);
		}
	});
});
