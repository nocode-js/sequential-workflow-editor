import {
	CustomValidatorContext,
	DefinitionContext,
	Path,
	PropertyModel,
	SimpleEvent,
	ValueModelContext
} from 'sequential-workflow-editor-model';
import { EditorServices, ValueEditor } from './value-editors';
import { Html } from './core/html';
import { Component } from './components/component';
import { PropertyValidationErrorComponent, propertyValidationErrorComponent } from './components/property-validation-error-component';

export class PropertyEditor implements Component {
	public static create(
		propertyModel: PropertyModel,
		definitionContext: DefinitionContext,
		editorServices: EditorServices
	): PropertyEditor {
		const valueContext = ValueModelContext.create(propertyModel.value, definitionContext);
		const valueEditorFactory = editorServices.valueEditorFactoryResolver(propertyModel.value.id);
		const valueEditor = valueEditorFactory(valueContext, editorServices);

		const nameClassName = propertyModel.name;
		const view = Html.element('div', {
			class: `swe-property swe-name-${nameClassName}`
		});
		const header = Html.element('div', {
			class: 'swe-property-header'
		});
		const label = Html.element('h4', {
			class: 'swe-property-header-label'
		});
		label.innerText = propertyModel.label;

		header.appendChild(label);
		view.appendChild(header);
		view.appendChild(valueEditor.view);

		if (valueEditor.controlView) {
			const control = Html.element('div', {
				class: 'swe-property-header-control'
			});
			control.appendChild(valueEditor.controlView);
			header.appendChild(control);
		}

		let validationError: PropertyValidationErrorComponent | null = null;
		if (propertyModel.customValidator) {
			const customValidationContext = CustomValidatorContext.create(propertyModel, definitionContext);
			validationError = propertyValidationErrorComponent(propertyModel.customValidator, customValidationContext);
			view.appendChild(validationError.view);
		}

		return new PropertyEditor(view, valueContext.onValueChanged, valueEditor, validationError);
	}

	public constructor(
		public readonly view: HTMLElement,
		public readonly onValueChanged: SimpleEvent<Path>,
		private readonly valueEditor: ValueEditor,
		private readonly validationError: PropertyValidationErrorComponent | null
	) {}

	public validate() {
		this.valueEditor.validate();
		if (this.validationError) {
			this.validationError.validate();
		}
	}
}
