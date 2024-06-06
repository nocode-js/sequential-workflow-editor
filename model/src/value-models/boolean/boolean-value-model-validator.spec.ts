import { createValueContextStub } from '../../test-tools/value-context-stub';
import { BooleanValueModel } from './boolean-value-model';
import { booleanValueModelValidator } from './boolean-value-model-validator';

describe('booleanValueModelValidator', () => {
	it('returns null if value is boolean', () => {
		const context = createValueContextStub<BooleanValueModel>(true, {});
		const error = booleanValueModelValidator(context);
		expect(error).toBeNull();
	});

	it('returns "The value must be a boolean" if value is not a boolean', () => {
		const context = createValueContextStub<BooleanValueModel>('this is not a boolean', {});
		const error = booleanValueModelValidator(context);
		expect(error?.$).toBe('The value must be a boolean');
	});
});
