import { ValueContext } from '../context';
import { ValueModel } from '../model';

export function createValueContextStub<TValueModel extends ValueModel>(value: unknown, configuration: object): ValueContext<TValueModel> {
	return {
		getValue: () => value,
		model: {
			configuration
		}
	} as unknown as ValueContext<TValueModel>;
}
