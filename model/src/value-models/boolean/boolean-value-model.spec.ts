import { DefaultValueContext } from '../../context/default-value-context';
import { Path } from '../../core';
import { createDefinitionModelStub } from '../../test-tools/definition-model-stub';
import { createModelActivatorStub } from '../../test-tools/model-activator-stub';
import { booleanValueModel } from './boolean-value-model';
import { BooleanValueModelConfiguration } from './boolean-value-model-configuration';

describe('booleanValueModel', () => {
	const definitionModel = createDefinitionModelStub();
	const modelActivator = createModelActivatorStub();
	const context = DefaultValueContext.create(modelActivator, {}, definitionModel.root.sequence);

	function getModel(configuration: BooleanValueModelConfiguration) {
		return booleanValueModel(configuration).create(Path.create('test'));
	}

	describe('getDefaultValue()', () => {
		it('returns false as default', () => {
			const value = getModel({}).getDefaultValue(context);

			expect(value).toBe(false);
		});

		it('returns the configured default value', () => {
			const valueTrue = getModel({ defaultValue: true }).getDefaultValue(context);
			expect(valueTrue).toBe(true);

			const valueFalse = getModel({ defaultValue: false }).getDefaultValue(context);
			expect(valueFalse).toBe(false);
		});
	});
});
