import { ValueModel, ValueModelFactoryFromModel, ValidationResult } from '../../model';
import { Path } from '../../core/path';
import { Dynamic } from '../../types';
import { ValueContext } from '../../context';
import { DefaultValueContext } from '../../context/default-value-context';

export interface DynamicValueModelConfiguration<TSubModels extends ValueModelFactoryFromModel[]> {
	models: TSubModels;
}

export type DynamicValueModel<TSubModels extends ValueModelFactoryFromModel[] = ValueModelFactoryFromModel[]> = ValueModel<
	Dynamic<TValueOf<TSubModels>>,
	DynamicValueModelConfiguration<ValueModelFactoryFromModel[]>
>;

type ReturnTypeOfModelFactory<TValueModelFactory> = TValueModelFactory extends ValueModelFactoryFromModel<infer U>[]
	? ReturnType<U['getDefaultValue']>
	: never;
type TValueOf<TValueModelFactory extends ValueModelFactoryFromModel[]> = ReturnTypeOfModelFactory<TValueModelFactory>;

export const dynamicValueModelId = 'dynamic';

export function createDynamicValueModel<TValueModelFactory extends ValueModelFactoryFromModel[]>(
	configuration: DynamicValueModelConfiguration<TValueModelFactory>
): ValueModelFactoryFromModel<DynamicValueModel<TValueModelFactory>> {
	if (configuration.models.length < 1) {
		throw new Error('Dynamic value model must have at least one choice');
	}

	return {
		create(path: Path) {
			const valuePath = path.add('value');
			const subModels = configuration.models.map(modelFactory => modelFactory.create(valuePath));

			return {
				id: dynamicValueModelId,
				label: 'Dynamic value',
				path,
				configuration,
				subModels,
				getDefaultValue(context: DefaultValueContext): Dynamic<TValueOf<TValueModelFactory>> {
					const model = subModels[0];
					return {
						modelId: model.id,
						value: model.getDefaultValue(context) as TValueOf<TValueModelFactory>
					};
				},
				getVariableDefinitions: () => null,
				validate(context: ValueContext<DynamicValueModel<TValueModelFactory>>): ValidationResult {
					const value = context.getValue();
					const model = subModels.find(m => m.id === value.modelId);
					if (!model) {
						const availableModels = subModels.map(m => m.id).join(', ');
						throw new Error(`Cannot find sub model id: ${value.modelId} (available: ${availableModels})`);
					}
					const childContext = context.createChildContext(model);
					return model.validate(childContext);
				}
			};
		}
	};
}
