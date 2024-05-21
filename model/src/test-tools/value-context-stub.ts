import { ValueContext } from '../context';
import { defaultI18n } from '../i18n';
import { ValueModel } from '../model';

export function createValueContextStub<TValueModel extends ValueModel>(
	value: unknown,
	configuration: TValueModel['configuration']
): ValueContext<TValueModel> {
	return {
		getValue: () => value,
		model: {
			configuration
		},
		i18n: defaultI18n
	} as unknown as ValueContext<TValueModel>;
}
