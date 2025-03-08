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
import { StackedSimpleEvent } from '../core';
import { createStepI18nPrefix } from '../core/step-i18n-prefix';

export class PropertyEditor implements Component {
	public static create(
		propertyModel: PropertyModel,
		stepType: string | null,
		definitionContext: DefinitionContext,
		editorServices: EditorServices
	): PropertyEditor {
		const valueContext = ValueContext.createFromDefinitionContext(
			propertyModel.value,
			propertyModel,
			definitionContext,
			editorServices.i18n
		);
		const valueEditorFactory = editorServices.valueEditorFactoryResolver.resolve(propertyModel.value.id, propertyModel.value.editorId);
		const valueEditor = valueEditorFactory(valueContext, editorServices);
		let hint: PropertyHintComponent | null = null;

		const nameClassName = propertyModel.path.last();
		const pathStr = propertyModel.path.toString();

		const view = Html.element('div', {
			class: `swe-property swe-name-${nameClassName}`
		});
		view.setAttribute('data-path', pathStr);

		const header = Html.element('div', {
			class: 'swe-property-header'
		});
		const label = Html.element('h4', {
			class: 'swe-property-header-label'
		});
		const i18nPrefix = createStepI18nPrefix(stepType);
		label.innerText = editorServices.i18n(i18nPrefix + pathStr, propertyModel.label);

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

		let control: HTMLElement | null = null;
		if (valueEditor.controlView) {
			control = Html.element('div', {
				class: 'swe-property-header-control'
			});
			control.appendChild(valueEditor.controlView);
			header.appendChild(control);
		}

		let propertyValidationError: PropertyValidationErrorComponent | null = null;
		if (propertyModel.validator) {
			const valueContext = ValueContext.createFromDefinitionContext(
				propertyModel.value,
				propertyModel,
				definitionContext,
				editorServices.i18n
			);
			const validatorContext = PropertyValidatorContext.create(valueContext);
			propertyValidationError = propertyValidationErrorComponent(propertyModel.validator, validatorContext);
			view.appendChild(propertyValidationError.view);
		}

		const editor = new PropertyEditor(view, valueContext.onValueChanged, valueEditor, control, propertyValidationError);
		if (propertyValidationError) {
			valueContext.onValueChanged.subscribe(editor.onValueChangedHandler);
		}
		if (valueEditor.onIsHiddenChanged) {
			valueEditor.onIsHiddenChanged.subscribe(editor.onEditorIsHiddenChanged);
		}
		editor.reloadVisibility();
		return editor;
	}

	private readonly onReloadVisibilityRequested = new StackedSimpleEvent<void>();

	public constructor(
		public readonly view: HTMLElement,
		public readonly onValueChanged: SimpleEvent<Path>,
		private readonly valueEditor: ValueEditor,
		private readonly control: HTMLElement | null,
		private readonly propertyValidationError: PropertyValidationErrorComponent | null
	) {
		this.onReloadVisibilityRequested.subscribe(this.reloadVisibility);
	}

	public reloadDependencies() {
		if (this.valueEditor.reloadDependencies) {
			this.valueEditor.reloadDependencies();
		}
		this.validateProperty();
		this.onReloadVisibilityRequested.push();
	}

	private validateProperty() {
		if (this.propertyValidationError) {
			this.propertyValidationError.validate();
		}
	}

	private readonly reloadVisibility = () => {
		const isValueEditorHidden = this.valueEditor.isHidden ? this.valueEditor.isHidden() : false;
		const isValidationErrorHidden = this.propertyValidationError ? this.propertyValidationError.isHidden() : true;

		const isPropertyEditorHidden = isValueEditorHidden && isValidationErrorHidden;

		Html.toggleClass(this.view, isPropertyEditorHidden, 'swe-hidden');
		Html.toggleClass(this.valueEditor.view, isValueEditorHidden, 'swe-hidden');
		if (this.control) {
			Html.toggleClass(this.control, isValueEditorHidden, 'swe-hidden');
		}
	};

	private readonly onValueChangedHandler = () => {
		this.validateProperty();
	};

	private readonly onEditorIsHiddenChanged = () => {
		this.onReloadVisibilityRequested.push();
	};
}
