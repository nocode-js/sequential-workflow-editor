import { ValueModel, ValueModelFactory, ValidationResult } from '../../model';
import { Path } from '../../core/path';
import { Dynamic } from '../../types';
import { ValueModelContext } from '../../context';
import { ModelActivator } from '../../activator';

export interface DynamicValueModelConfiguration<TSubModels extends ValueModelFactory[]> {
	models: TSubModels;
}

export type DynamicValueModel<TSubModels extends ValueModelFactory[] = ValueModelFactory[]> = ValueModel<
	Dynamic<TValueOf<TSubModels>>,
	DynamicValueModelConfiguration<ValueModelFactory[]>
>;

type ReturnTypeOfModelFactory<TValueModelFactory> = TValueModelFactory extends ValueModelFactory<infer U>[]
	? ReturnType<U['getDefaultValue']>
	: never;
type TValueOf<TValueModelFactory extends ValueModelFactory[]> = ReturnTypeOfModelFactory<TValueModelFactory>;

export const dynamicValueModelId = 'dynamic';

export function dynamicValueModel<TValueModelFactory extends ValueModelFactory[]>(
	configuration: DynamicValueModelConfiguration<TValueModelFactory>
): ValueModelFactory<DynamicValueModel<TValueModelFactory>> {
	if (configuration.models.length < 1) {
		throw new Error('Dynamic value model must have at least one choice');
	}

	return (path: Path) => {
		const valuePath = path.add('value');
		const subModels = configuration.models.map(modelFactory => modelFactory(valuePath));

		return {
			id: dynamicValueModelId,
			label: 'Dynamic value',
			path,
			configuration,
			subModels,
			getDefaultValue(activator: ModelActivator): Dynamic<TValueOf<TValueModelFactory>> {
				const model = subModels[0];
				return {
					modelId: model.id,
					value: model.getDefaultValue(activator) as TValueOf<TValueModelFactory>
				};
			},
			getVariableDefinitions: () => null,
			validate(context: ValueModelContext<DynamicValueModel<TValueModelFactory>>): ValidationResult {
				const value = context.getValue();
				const model = subModels.find(m => m.id === value.modelId);
				if (!model) {
					throw new Error(`Cannot find model id: ${value.modelId}`);
				}
				const childContext = context.createChildContext(model);
				return model.validate(childContext);
			}
		};
	};
}
