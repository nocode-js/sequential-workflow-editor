import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { ContextVariable, DefinitionModel } from '../model';
import { DefinitionContext } from './definition-context';
import { PropertyModels } from '../model';
import { ValueContext } from './value-context';

export class ParentsProvider {
	public static createForStep(
		step: Step,
		definition: Definition,
		definitionModel: DefinitionModel,
		definitionWalker: DefinitionWalker
	): ParentsProvider {
		return new ParentsProvider(step, definition, definitionModel, definitionWalker);
	}

	public static createForRoot(
		definition: Definition,
		definitionModel: DefinitionModel,
		definitionWalker: DefinitionWalker
	): ParentsProvider {
		return new ParentsProvider(null, definition, definitionModel, definitionWalker);
	}

	private constructor(
		private readonly step: Step | null,
		private readonly definition: Definition,
		private readonly definitionModel: DefinitionModel,
		private readonly definitionWalker: DefinitionWalker
	) {}

	public getVariables(): ContextVariable[] {
		const result: ContextVariable[] = [];

		const rootContext = DefinitionContext.createForRoot(this.definition, this.definitionModel, this.definitionWalker);
		this.appendVariables(result, null, this.definitionModel.root.properties, rootContext);

		if (this.step) {
			const parents = this.definitionWalker.getParents(this.definition, this.step);
			const count = parents.length;
			for (let index = 0; index < count; index++) {
				const parent = parents[index];
				if (typeof parent === 'string') {
					continue;
				}

				const parentModel = this.definitionModel.steps[parent.type];
				if (!parentModel) {
					throw new Error(`Unknown step type: ${parent.type}`);
				}

				const parentContext = DefinitionContext.createForStep(parent, this.definition, this.definitionModel, this.definitionWalker);
				this.appendVariables(result, parent.id, parentModel.properties, parentContext);
			}
		}
		return result;
	}

	private appendVariables(
		result: ContextVariable[],
		stepId: string | null,
		propertyModels: PropertyModels,
		definitionContext: DefinitionContext
	) {
		for (const propertyModel of propertyModels) {
			const valueContext = ValueContext.createFromDefinitionContext(propertyModel.value, propertyModel, definitionContext);
			const definitions = propertyModel.value.getVariableDefinitions(valueContext);

			if (!definitions) {
				continue;
			}

			for (const definition of definitions) {
				result.push({
					name: definition.name,
					type: definition.type,
					stepId,
					valueModelPath: propertyModel.value.path
				});
			}
		}
	}

	public readonly getParentStepTypes = (): string[] => {
		if (this.step) {
			const parents = this.definitionWalker.getParents(this.definition, this.step);
			return (parents.slice(0, parents.length - 1).filter(p => typeof p === 'object') as Step[]).map(p => p.type);
		}
		return [];
	};
}
