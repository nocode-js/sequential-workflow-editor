import { PropertyValidator, PropertyValidatorContext } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { validationErrorComponent } from './validation-error-component';

export interface PropertyValidationErrorComponent extends Component {
	validate(): void;
	isHidden(): boolean;
}

export function propertyValidationErrorComponent(
	validator: PropertyValidator,
	context: PropertyValidatorContext
): PropertyValidationErrorComponent {
	const validation = validationErrorComponent();

	function validate() {
		const error = validator.validate(context);
		validation.setError(error);
	}

	validate();

	return {
		view: validation.view,
		validate,
		isHidden: validation.isHidden
	};
}
