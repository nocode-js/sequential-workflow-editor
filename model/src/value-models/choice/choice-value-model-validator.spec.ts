import { createValueContextStub } from '../../test-tools/value-context-stub';
import { ChoiceValueModel } from './choice-value-model';
import { ChoiceValueModelConfiguration } from './choice-value-model-configuration';
import { choiceValueModelValidator } from './choice-value-model-validator';

describe('choiceValueModelValidator', () => {
	it('returns correct response', () => {
		const configuration: ChoiceValueModelConfiguration = {
			choices: ['x', 'y']
		};

		const context1 = createValueContextStub<ChoiceValueModel>('z', configuration);
		const error1 = choiceValueModelValidator(context1);
		expect(error1?.$).toBe('Value is not supported');

		const context2 = createValueContextStub<ChoiceValueModel>('x', configuration);
		const error2 = choiceValueModelValidator(context2);
		expect(error2).toBe(null);
	});
});
