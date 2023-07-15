import { Definition, Step } from 'sequential-workflow-model';
import { DefinitionModel, PropertyModel, PropertyModels } from '../model';
import { UidGenerator } from '../external-types';
import { DefaultValueContext } from '../context/default-value-context';

export class ModelActivator<TDefinition extends Definition = Definition> {
	public static create<TDef extends Definition>(
		definitionModel: DefinitionModel<TDef>,
		uidGenerator: UidGenerator
	): ModelActivator<TDef> {
		return new ModelActivator(definitionModel, uidGenerator);
	}

	private constructor(private readonly definitionModel: DefinitionModel, private readonly uidGenerator: UidGenerator) {}

	public readonly activateDefinition = (): TDefinition => {
		const definition: Omit<Definition, 'sequence'> = {
			properties: {}
		};
		this.activatePropertiesInOrder(definition, this.definitionModel.root.properties);

		const sequenceValueContext = DefaultValueContext.create(this, definition, this.definitionModel.root.sequence);
		const sequence = this.definitionModel.root.sequence.value.getDefaultValue(sequenceValueContext);
		return {
			...definition,
			sequence
		} as TDefinition;
	};

	public readonly activateStep = <TStep extends Step>(stepType: string): TStep => {
		const model = this.definitionModel.steps[stepType];
		if (!model) {
			throw new Error(`Unknown step type: ${stepType}`);
		}
		const step: Omit<Step, 'name'> = {
			id: this.uidGenerator(),
			type: stepType,
			componentType: model.componentType,
			properties: {}
		};
		this.activatePropertiesInOrder(step, model.properties);

		const nameValueContext = DefaultValueContext.create(this, step, model.name);
		const name = model.name.value.getDefaultValue(nameValueContext);
		return {
			...step,
			name
		} as TStep;
	};

	private activatePropertiesInOrder(object: object, models: PropertyModels) {
		let i: number;
		for (i = 0; i < models.length; i++) {
			const model = models[i];
			if (model.dependencies.length === 0) {
				this.activateProperty(object, model);
			}
		}
		for (i = 0; i < models.length; i++) {
			const model = models[i];
			if (model.dependencies.length > 0) {
				this.activateProperty(object, model);
			}
		}
	}

	private activateProperty(object: object, model: PropertyModel) {
		const defaultValueContext = DefaultValueContext.create(this, object, model);
		const defaultValue = model.value.getDefaultValue(defaultValueContext);
		model.value.path.write(object, defaultValue);
	}
}
