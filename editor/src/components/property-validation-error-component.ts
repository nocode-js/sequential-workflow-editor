import { CustomValidator, CustomValidatorContext } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { validationErrorComponent } from './validation-error-component';

export interface PropertyValidationErrorComponent extends Component {
	validate(): void;
}

export function propertyValidationErrorComponent(
	validator: CustomValidator,
	context: CustomValidatorContext
): PropertyValidationErrorComponent {
	const validation = validationErrorComponent();

	function validate() {
		const error = validator.validate(context);
		validation.setError(error);
	}

	validate();

	return {
		view: validation.view,
		validate
	};
}
