import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { DefinitionModel, PropertyModel, PropertyModels, ValidationError, ValidationResult, createValidationSingleError } from '../model';
import { DefinitionContext, ValueContext } from '../context';
import { PropertyValidatorContext } from './property-validator-context';
import { Path } from '../core';
import { StepValidatorContext } from './step-validator-context';
import { I18n, defaultI18n } from '../i18n';

export class DefinitionValidator {
	public static create(definitionModel: DefinitionModel, definitionWalker: DefinitionWalker, i18n?: I18n): DefinitionValidator {
		return new DefinitionValidator(definitionModel, definitionWalker, i18n ?? defaultI18n);
	}

	private constructor(
		private readonly model: DefinitionModel,
		private readonly walker: DefinitionWalker,
		private readonly i18n: I18n
	) {}

	/**
	 * Deeply validates the given definition.
	 * @param definition The definition to validate.
	 * @returns `null` if the definition is valid, otherwise an object describing the validation error.
	 */
	public validate(definition: Definition): DefinitionValidationError | null {
		const rootError = this.validateRoot(definition);
		if (rootError) {
			return {
				...rootError,
				stepId: null
			};
		}

		let result: DefinitionValidationError | null = null;
		this.walker.forEach(definition, step => {
			const stepError = this.validateStep(step, definition);
			if (stepError) {
				result = {
					...stepError,
					stepId: step.id
				};
				return false; // stops walking
			}
		});
		return result;
	}

	public validateStep(step: Step, definition: Definition): PropertyValidationError | null {
		const definitionContext = DefinitionContext.createForStep(step, definition, this.model, this.walker, this.i18n);

		const stepModel = this.model.steps[step.type];
		if (!stepModel) {
			throw new Error(`Cannot find model for step type: ${step.type}`);
		}

		if (stepModel.validator) {
			const stepContext = StepValidatorContext.create(definitionContext);
			const stepError = stepModel.validator.validate(stepContext);
			if (stepError) {
				return {
					propertyPath: Path.root(),
					error: createValidationSingleError(stepError)
				};
			}
		}

		const nameError = this.validateProperty(stepModel.name, definitionContext);
		if (nameError) {
			return {
				propertyPath: stepModel.name.path,
				error: nameError
			};
		}
		return this.validateProperties(stepModel.properties, definitionContext);
	}

	public validateRoot(definition: Definition): PropertyValidationError | null {
		const definitionContext = DefinitionContext.createForRoot(definition, this.model, this.walker, this.i18n);
		return this.validateProperties(this.model.root.properties, definitionContext);
	}

	private validateProperties(properties: PropertyModels, definitionContext: DefinitionContext): PropertyValidationError | null {
		for (const propertyName of properties) {
			const error = this.validateProperty(propertyName, definitionContext);
			if (error) {
				return {
					propertyPath: propertyName.path,
					error
				};
			}
		}
		return null;
	}

	private validateProperty(propertyModel: PropertyModel, definitionContext: DefinitionContext): ValidationResult {
		const valueContext = ValueContext.createFromDefinitionContext(propertyModel.value, propertyModel, definitionContext, this.i18n);
		const valueError = propertyModel.value.validate(valueContext);
		if (valueError) {
			return valueError;
		}

		if (propertyModel.validator) {
			const propertyContext = PropertyValidatorContext.create(valueContext);
			const propertyError = propertyModel.validator.validate(propertyContext);
			if (propertyError) {
				return createValidationSingleError(propertyError);
			}
		}
		return null;
	}
}

export interface PropertyValidationError {
	propertyPath: Path;
	error: ValidationError;
}

export interface DefinitionValidationError extends PropertyValidationError {
	/**
	 * Step id. If it is `null` then the error is related to the root.
	 */
	stepId: string | null;
}
