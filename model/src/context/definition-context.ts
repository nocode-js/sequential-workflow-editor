import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { DefinitionModel } from '../model';
import { ParentsProvider } from './variables-provider';
import { I18n } from '../i18n';

export class DefinitionContext {
	public static createForStep(
		step: Step,
		definition: Definition,
		definitionModel: DefinitionModel,
		definitionWalker: DefinitionWalker,
		i18n: I18n
	): DefinitionContext {
		const parentsProvider = ParentsProvider.createForStep(step, definition, definitionModel, definitionWalker, i18n);
		return new DefinitionContext(step, definition, definitionModel, parentsProvider);
	}

	public static createForRoot(
		definition: Definition,
		definitionModel: DefinitionModel,
		definitionWalker: DefinitionWalker,
		i18n: I18n
	): DefinitionContext {
		const parentsProvider = ParentsProvider.createForRoot(definition, definitionModel, definitionWalker, i18n);
		return new DefinitionContext(definition, definition, definitionModel, parentsProvider);
	}

	private constructor(
		public readonly object: Step | Definition,
		public readonly definition: Definition,
		public readonly definitionModel: DefinitionModel,
		public readonly parentsProvider: ParentsProvider
	) {}
}
