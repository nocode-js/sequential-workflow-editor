import { createValueContextStub } from '../../test-tools/value-context-stub';
import { NumberValueModel } from './number-value-model';
import { NumberValueModelConfiguration } from './number-value-model-configuration';
import { numberValueModelValidator } from './number-value-model-validator';

describe('numberValueModelValidator', () => {
	it('returns error when value is not a number', () => {
		const context1 = createValueContextStub<NumberValueModel>(NaN, {});
		const error1 = numberValueModelValidator(context1);
		expect(error1?.$).toBe('The value must be a number');

		const context2 = createValueContextStub<NumberValueModel>('10', {});
		const error2 = numberValueModelValidator(context2);
		expect(error2?.$).toBe('The value must be a number');
	});

	it('returns error when value is too small', () => {
		const configuration: NumberValueModelConfiguration = {
			min: 10
		};

		const context = createValueContextStub<NumberValueModel>(5, configuration);
		const error = numberValueModelValidator(context);
		expect(error?.$).toBe('The value must be at least 10');
	});

	it('returns error when value is too big', () => {
		const configuration: NumberValueModelConfiguration = {
			max: 10
		};

		const context = createValueContextStub<NumberValueModel>(15, configuration);
		const error = numberValueModelValidator(context);
		expect(error?.$).toBe('The value must be at most 10');
	});

	it('returns null when value is correct', () => {
		const configuration: NumberValueModelConfiguration = {
			min: 1,
			max: 10
		};

		const context = createValueContextStub<NumberValueModel>(5, configuration);
		const error = numberValueModelValidator(context);
		expect(error).toBe(null);
	});
});
