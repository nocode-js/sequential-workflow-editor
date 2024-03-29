import {
	PropertyValidatorContext,
	DefinitionContext,
	Path,
	PropertyModel,
	SimpleEvent,
	ValueContext
} from 'sequential-workflow-editor-model';
import { EditorServices, ValueEditor } from '../value-editors';
import { Html } from '../core/html';
import { Component } from '../components/component';
import { PropertyValidationErrorComponent, propertyValidationErrorComponent } from '../components/property-validation-error-component';
import { Icons } from '../core/icons';
import { PropertyHintComponent, propertyHint } from './property-hint';

export class PropertyEditor implements Component {
	public static create(
		propertyModel: PropertyModel,
		definitionContext: DefinitionContext,
		editorServices: EditorServices
	): PropertyEditor {
		const valueContext = ValueContext.createFromDefinitionContext(propertyModel.value, propertyModel, definitionContext);
		const valueEditorFactory = editorServices.valueEditorFactoryResolver.resolve(propertyModel.value.id, propertyModel.value.editorId);
		const valueEditor = valueEditorFactory(valueContext, editorServices);
		let hint: PropertyHintComponent | null = null;

		const nameClassName = propertyModel.path.last();
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

		if (propertyModel.hint) {
			const toggle = Html.element('span', {
				class: 'swe-property-header-hint-toggle'
			});
			const toggleIcon = Icons.createSvg(Icons.help, 'swe-property-header-hint-toggle-icon');
			toggle.appendChild(toggleIcon);
			toggle.addEventListener('click', () => hint?.toggle(), false);
			header.appendChild(toggle);

			hint = propertyHint(propertyModel.hint);
			view.appendChild(hint.view);
		}

		view.appendChild(valueEditor.view);

		if (valueEditor.controlView) {
			const control = Html.element('div', {
				class: 'swe-property-header-control'
			});
			control.appendChild(valueEditor.controlView);
			header.appendChild(control);
		}

		let validationError: PropertyValidationErrorComponent | null = null;
		if (propertyModel.validator) {
			const valueContext = ValueContext.createFromDefinitionContext(propertyModel.value, propertyModel, definitionContext);
			const validatorContext = PropertyValidatorContext.create(valueContext);
			validationError = propertyValidationErrorComponent(propertyModel.validator, validatorContext);
			view.appendChild(validationError.view);
		}

		const editor = new PropertyEditor(view, valueContext.onValueChanged, valueEditor, validationError);
		if (propertyModel.validator) {
			valueContext.onValueChanged.subscribe(editor.onValueChangedHandler);
		}
		return editor;
	}

	public constructor(
		public readonly view: HTMLElement,
		public readonly onValueChanged: SimpleEvent<Path>,
		private readonly valueEditor: ValueEditor,
		private readonly validationError: PropertyValidationErrorComponent | null
	) {}

	public reloadDependencies() {
		if (this.valueEditor.reloadDependencies) {
			this.valueEditor.reloadDependencies();
		}
		this.revalidate();
	}

	private revalidate() {
		if (this.validationError) {
			this.validationError.validate();
		}
	}

	private readonly onValueChangedHandler = () => {
		this.revalidate();
	};
}
