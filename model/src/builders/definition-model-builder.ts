import { Definition } from 'sequential-workflow-model';
import { DefinitionModel, RootModel, StepModel, StepModels } from '../model';
import { ValueType } from '../types';

export class DefinitionModelBuilder<TDefinition extends Definition> {
	private rootModel?: RootModel;
	private readonly stepModels: StepModels = {};
	private _valueTypes?: ValueType[];

	public constructor() {
		// Nothing...
	}

	public root(model: RootModel) {
		if (this.rootModel) {
			throw new Error('Root model is already defined');
		}
		this.rootModel = model;
	}

	public steps(models: StepModel[]) {
		for (const model of models) {
			if (this.stepModels[model.type]) {
				throw new Error(`Step model with type ${model.type} is already defined`);
			}
			this.stepModels[model.type] = model;
		}
	}

	public valueTypes(valueTypes: ValueType[]): this {
		if (this._valueTypes) {
			throw new Error('Value types are already set');
		}
		this._valueTypes = valueTypes;
		return this;
	}

	public build(): DefinitionModel<TDefinition> {
		if (!this.rootModel) {
			throw new Error('Root model is not defined');
		}

		return {
			root: this.rootModel,
			steps: this.stepModels,
			valueTypes: this._valueTypes ?? []
		};
	}
}

export function createDefinitionModel<TDefinition extends Definition = Definition>(
	build: (builder: DefinitionModelBuilder<TDefinition>) => void
): DefinitionModel<TDefinition> {
	const builder = new DefinitionModelBuilder<TDefinition>();
	build(builder);
	return builder.build();
}
