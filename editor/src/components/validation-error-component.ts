import { ValidationResult } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { Html } from '../core/html';

export interface ValidationErrorComponent extends Component {
	setError(error: string | null): void;
	setDefaultError(result: ValidationResult): void;
}

export function validationErrorComponent(): ValidationErrorComponent {
	const view = Html.element('div', {
		class: 'swe-validation-error'
	});
	let child: HTMLElement | null = null;

	function setError(error: string | null) {
		if (child) {
			view.removeChild(child);
			child = null;
		}
		if (error) {
			child = Html.element('div', {
				class: 'swe-validation-error-text'
			});
			child.textContent = error;
			view.appendChild(child);
		}
	}

	function setDefaultError(result: ValidationResult) {
		setError(result && result['$']);
	}

	return {
		view,
		setError,
		setDefaultError
	};
}
