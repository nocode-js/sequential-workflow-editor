import { SimpleEvent, ValidationResult } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { Html } from '../core/html';

export interface ValidationErrorComponent extends Component {
	onIsHiddenChanged: SimpleEvent<boolean>;
	isHidden(): boolean;
	setError(error: string | null): void;
	setDefaultError(result: ValidationResult): void;
}

export function validationErrorComponent(): ValidationErrorComponent {
	const view = Html.element('div', {
		class: 'swe-validation-error'
	});
	const onIsHiddenChanged = new SimpleEvent<boolean>();
	let child: HTMLElement | null = null;

	function isHidden() {
		return child === null;
	}

	function setError(error: string | null) {
		const oldState = isHidden();

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

		const newState = isHidden();
		if (oldState !== newState) {
			onIsHiddenChanged.forward(newState);
		}
	}

	function setDefaultError(result: ValidationResult) {
		setError(result && result['$']);
	}

	return {
		onIsHiddenChanged,
		view,
		isHidden,
		setError,
		setDefaultError
	};
}
