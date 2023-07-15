import { Definition } from 'sequential-workflow-model';
import { DefinitionModel, RootModel, StepModel, StepModels } from '../model';
import { ValueType } from '../types';
import { RootModelBuilder, createRootModel } from './root-model-builder';

export class DefinitionModelBuilder<TDefinition extends Definition> {
	private rootModel?: RootModel;
	private readonly stepModels: StepModels = {};
	private _valueTypes?: ValueType[];

	public constructor() {
		// Nothing...
	}

	public root(modelOrCallback: RootModel | ((builder: RootModelBuilder<TDefinition['properties']>) => void)): this {
		if (this.rootModel) {
			throw new Error('Root model is already defined');
		}
		if (typeof modelOrCallback === 'function') {
			this.rootModel = createRootModel(modelOrCallback);
		} else {
			this.rootModel = modelOrCallback;
		}
		return this;
	}

	public steps(models: StepModel[]): this {
		for (const model of models) {
			this.step(model);
		}
		return this;
	}

	public step(model: StepModel): this {
		if (this.stepModels[model.type]) {
			throw new Error(`Step model with type ${model.type} is already defined`);
		}
		this.stepModels[model.type] = model;
		return this;
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
