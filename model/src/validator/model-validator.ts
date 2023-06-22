import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { DefinitionModel, PropertyModel, PropertyModels } from '../model';
import { DefinitionContext, ValueContext } from '../context';
import { CustomValidatorContext } from './custom-validator-context';

export class ModelValidator {
	public static create(model: DefinitionModel, definitionWalker: DefinitionWalker): ModelValidator {
		return new ModelValidator(model, definitionWalker);
	}

	private constructor(private readonly model: DefinitionModel, private readonly definitionWalker: DefinitionWalker) {}

	public validateStep(step: Step, definition: Definition): boolean {
		const definitionContext = DefinitionContext.createForStep(step, definition, this.model, this.definitionWalker);

		const stepModel = this.model.steps[step.type];
		if (!stepModel) {
			throw new Error(`Cannot find model for step type: ${step.type}`);
		}

		return this.validateProperty(stepModel.name, definitionContext) && this.validateProperties(stepModel.properties, definitionContext);
	}

	public validateRoot(definition: Definition): boolean {
		const definitionContext = DefinitionContext.createForRoot(definition, this.model, this.definitionWalker);
		return this.validateProperties(this.model.root.properties, definitionContext);
	}

	private validateProperties(properties: PropertyModels, definitionContext: DefinitionContext): boolean {
		return properties.every(propertyModel => this.validateProperty(propertyModel, definitionContext));
	}

	private validateProperty(propertyModel: PropertyModel, definitionContext: DefinitionContext): boolean {
		const valueContext = ValueContext.create(propertyModel.value, propertyModel, definitionContext);
		if (propertyModel.value.validate(valueContext)) {
			return false;
		}

		if (propertyModel.customValidator) {
			const validatorContext = CustomValidatorContext.create(propertyModel, definitionContext);
			const error = propertyModel.customValidator.validate(validatorContext);
			if (error) {
				return false;
			}
		}
		return true;
	}
}
