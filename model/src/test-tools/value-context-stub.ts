import { ValueContext } from '../context';
import { ValueModel } from '../model';

export function createValueContextStub<TValueModel extends ValueModel>(
	value: unknown,
	configuration: TValueModel['configuration']
): ValueContext<TValueModel> {
	return {
		getValue: () => value,
		model: {
			configuration
		}
	} as unknown as ValueContext<TValueModel>;
}
