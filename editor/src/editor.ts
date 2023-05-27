import { DefinitionContext, Path, PropertyModel, PropertyModels, SimpleEvent } from 'sequential-workflow-editor-model';
import { PropertyEditor } from './property-editor';
import { EditorServices, ValueEditorEditorFactoryResolver } from './value-editors';

export class Editor {
	public static create(
		propertyModels: PropertyModels,
		definitionContext: DefinitionContext,
		editorServices: EditorServices,
		typeClassName: string
	): Editor {
		const root = document.createElement('div');
		root.className = `swe-editor swe-type-${typeClassName}`;

		const editors = new Map<PropertyModel, PropertyEditor>();
		for (const propertyModel of propertyModels) {
			if (ValueEditorEditorFactoryResolver.isHidden(propertyModel.value.id)) {
				continue;
			}

			const propertyEditor = PropertyEditor.create(propertyModel, definitionContext, editorServices);
			root.appendChild(propertyEditor.view);
			editors.set(propertyModel, propertyEditor);
		}

		const editor = new Editor(root, editors);
		editors.forEach(e => e.onValueChanged.subscribe(editor.onValueChangedHandler));
		return editor;
	}

	public readonly onValueChanged = new SimpleEvent<Path>();

	private constructor(public readonly root: HTMLElement, private readonly editors: Map<PropertyModel, PropertyEditor>) {}

	private readonly onValueChangedHandler = (path: Path) => {
		this.onValueChanged.forward(path);

		this.editors.forEach((editor, propertyModel) => {
			if (propertyModel.value.path.equals(path)) {
				// Skip self
				return;
			}

			if (propertyModel.dependencies.some(dep => dep.startsWith(path))) {
				editor.validate();
			}
		});
	};
}
