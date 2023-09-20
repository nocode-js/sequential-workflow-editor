import { DefinitionContext } from '../context';
import { ParentsProvider } from '../context/variables-provider';

export class StepValidatorContext {
	public static create(definitionContext: DefinitionContext): StepValidatorContext {
		return new StepValidatorContext(definitionContext.parentsProvider);
	}

	private constructor(private readonly parentsProvider: ParentsProvider) {}

	/**
	 * @returns The parent step types.
	 * @example `['loop', 'if']`
	 */
	public readonly getParentStepTypes = this.parentsProvider.getParentStepTypes;
}
