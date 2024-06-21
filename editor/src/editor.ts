import { DefinitionContext, Path, PropertyModel, PropertyModels } from 'sequential-workflow-editor-model';
import { PropertyEditor } from './property-editor/property-editor';
import { EditorServices } from './value-editors';
import { EditorHeader, EditorHeaderData } from './editor-header';
import { StackedSimpleEvent } from './core/stacked-simple-event';
import { ValidationErrorComponent, validationErrorComponent } from './components/validation-error-component';

export type EditorValidator = () => string | null;

export class Editor {
	public static create(
		headerData: EditorHeaderData | null,
		validator: EditorValidator | null,
		propertyModels: PropertyModels,
		stepType: string | null,
		definitionContext: DefinitionContext,
		editorServices: EditorServices
	): Editor {
		const root = document.createElement('div');
		root.className = `swe-editor swe-type-${stepType ?? 'root'}`;

		if (headerData) {
			const header = EditorHeader.create(headerData, stepType ?? 'root', editorServices.i18n);
			root.appendChild(header.view);
		}

		let validationComponent: ValidationErrorComponent | null = null;
		if (validator) {
			validationComponent = validationErrorComponent();
			root.appendChild(validationComponent.view);
		}

		const editors = new Map<PropertyModel, PropertyEditor>();
		for (const propertyModel of propertyModels) {
			const propertyEditor = PropertyEditor.create(propertyModel, stepType, definitionContext, editorServices);
			root.appendChild(propertyEditor.view);
			editors.set(propertyModel, propertyEditor);
		}

		const editor = new Editor(root, editors, validator, validationComponent);
		editors.forEach(e => e.onValueChanged.subscribe(editor.onValueChangedHandler));
		editor.validate();
		return editor;
	}

	public readonly onValuesChanged = new StackedSimpleEvent<Path>();

	private constructor(
		public readonly root: HTMLElement,
		private readonly editors: Map<PropertyModel, PropertyEditor>,
		private readonly validator: EditorValidator | null,
		private readonly validationErrorComponent: ValidationErrorComponent | null
	) {}

	private validate() {
		if (this.validator && this.validationErrorComponent) {
			const error = this.validator();
			this.validationErrorComponent.setError(error);
		}
	}

	private readonly onValueChangedHandler = (path: Path) => {
		this.onValuesChanged.push(path);
		// console.log('onValueChangedHandler', path.toString());

		this.editors.forEach((editor, propertyModel) => {
			if (path.startsWith(propertyModel.path)) {
				// Skip self
				return;
			}
			if (propertyModel.dependencies.some(dependency => path.startsWith(dependency))) {
				editor.reloadDependencies();
			}
		});
	};
}
