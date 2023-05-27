import { Definition, Step } from 'sequential-workflow-model';
import { DefinitionModel, PropertyModels } from '../model';
import { UidGenerator } from '../external-types';

export class ModelActivator<TDefinition extends Definition = Definition> {
	public static create<TDef extends Definition>(
		definitionModel: DefinitionModel<TDef>,
		uidGenerator: UidGenerator
	): ModelActivator<TDef> {
		return new ModelActivator(definitionModel, uidGenerator);
	}

	private constructor(private readonly definitionModel: DefinitionModel, private readonly uidGenerator: UidGenerator) {}

	public activateDefinition(): TDefinition {
		const definition: Definition = {
			properties: {},
			sequence: this.definitionModel.root.sequence.value.getDefaultValue(this)
		};
		this.activateProperties(definition, this.definitionModel.root.properties);
		return definition as TDefinition;
	}

	public activateStep<TStep extends Step>(stepType: string): TStep {
		const model = this.definitionModel.steps[stepType];
		if (!model) {
			throw new Error(`Unknown step type: ${stepType}`);
		}
		const step: Step = {
			id: this.uidGenerator(),
			name: model.name.value.getDefaultValue(this),
			type: stepType,
			componentType: model.componentType,
			properties: {}
		};
		this.activateProperties(step, model.properties);
		return step as TStep;
	}

	private activateProperties(object: object, models: PropertyModels) {
		for (const model of models) {
			const defaultValue = model.value.getDefaultValue(this);
			model.value.path.write(object, defaultValue);
		}
	}
}
