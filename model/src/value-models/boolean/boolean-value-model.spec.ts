import { Path } from '../../core';
import { createModelActivatorStub } from '../../test-tools/model-activator-stub';
import { booleanValueModel } from './boolean-value-model';
import { BooleanValueModelConfiguration } from './boolean-value-model-configuration';

describe('booleanValueModel', () => {
	const modelActivator = createModelActivatorStub();

	function getModel(configuration: BooleanValueModelConfiguration) {
		return booleanValueModel(configuration)(Path.create('test'));
	}

	describe('getDefaultValue()', () => {
		it('returns false as default', () => {
			const value = getModel({}).getDefaultValue(modelActivator);

			expect(value).toBe(false);
		});

		it('returns the configured default value', () => {
			const valueTrue = getModel({ defaultValue: true }).getDefaultValue(modelActivator);
			expect(valueTrue).toBe(true);

			const valueFalse = getModel({ defaultValue: false }).getDefaultValue(modelActivator);
			expect(valueFalse).toBe(false);
		});
	});
});
