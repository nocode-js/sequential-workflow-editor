import { DefinitionContext, Path, PropertyModel, PropertyModels } from 'sequential-workflow-editor-model';
import { PropertyEditor } from './property-editor/property-editor';
import { EditorServices, ValueEditorEditorFactoryResolver } from './value-editors';
import { EditorHeader, EditorHeaderData } from './editor-header';
import { StackedSimpleEvent } from './core/stacked-simple-event';

export class Editor {
	public static create(
		headerData: EditorHeaderData | null,
		propertyModels: PropertyModels,
		definitionContext: DefinitionContext,
		editorServices: EditorServices,
		typeClassName: string
	): Editor {
		const root = document.createElement('div');
		root.className = `swe-editor swe-type-${typeClassName}`;

		if (headerData) {
			const header = EditorHeader.create(headerData);
			root.appendChild(header.view);
		}

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

	public readonly onValuesChanged = new StackedSimpleEvent<Path>();

	private constructor(public readonly root: HTMLElement, private readonly editors: Map<PropertyModel, PropertyEditor>) {}

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
