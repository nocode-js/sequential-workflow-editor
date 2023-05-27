import { ValueModel, ValueModelFactory, ValidationResult } from '../../model';
import { Path } from '../../core/path';
import { Dynamic } from '../../types';
import { ValueModelContext } from '../../context';
import { ModelActivator } from '../../activator';

export interface DynamicValueModelConfiguration<TChoices extends ValueModelFactory[]> {
	choices: TChoices;
}

export type DynamicValueModel<TModels extends ValueModelFactory[] = ValueModelFactory[]> = ValueModel<
	Dynamic<TValueOf<TModels>>,
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
	if (configuration.choices.length < 1) {
		throw new Error('Dynamic value model must have at least one choice');
	}

	return (path: Path) => {
		const valuePath = path.add('value');
		const childModels = configuration.choices.map(modelFactory => modelFactory(valuePath));

		return {
			id: dynamicValueModelId,
			path,
			configuration,
			childModels,
			getDefaultValue(activator: ModelActivator): Dynamic<TValueOf<TValueModelFactory>> {
				const model = childModels[0];
				return {
					modelId: model.id,
					value: model.getDefaultValue(activator) as TValueOf<TValueModelFactory>
				};
			},
			getVariableDefinitions: () => null,
			validate(context: ValueModelContext<DynamicValueModel<TValueModelFactory>>): ValidationResult {
				const value = context.getValue();
				const model = childModels.find(m => m.id === value.modelId);
				if (!model) {
					throw new Error(`Cannot find model id: ${value.modelId}`);
				}
				const childContext = context.createChildContext(model);
				return model.validate(childContext);
			}
		};
	};
}
