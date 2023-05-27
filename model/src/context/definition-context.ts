import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { DefinitionModel } from '../model';
import { VariablesProvider } from './variables-provider';

export class DefinitionContext {
	public static createForStep(
		step: Step,
		definition: Definition,
		definitionModel: DefinitionModel,
		definitionWalker: DefinitionWalker
	): DefinitionContext {
		const variablesProvider = VariablesProvider.createForStep(step, definition, definitionModel, definitionWalker);
		return new DefinitionContext(step, definition, definitionModel, variablesProvider);
	}

	public static createForRoot(
		definition: Definition,
		definitionModel: DefinitionModel,
		definitionWalker: DefinitionWalker
	): DefinitionContext {
		const variablesProvider = VariablesProvider.createForRoot(definition, definitionModel, definitionWalker);
		return new DefinitionContext(definition, definition, definitionModel, variablesProvider);
	}

	private constructor(
		public readonly object: Step | Definition,
		public readonly definition: Definition,
		public readonly definitionModel: DefinitionModel,
		public readonly variablesProvider: VariablesProvider
	) {}
}
