import { EditorServices, ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { DynamicValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { selectComponent } from '../../components/select-component';
import { Html } from '../../core/html';

export const dynamicValueEditorId = 'dynamic';

export function dynamicValueEditor(
	context: ValueModelContext<DynamicValueModel>,
	services: EditorServices
): ValueEditor<DynamicValueModel> {
	if (!context.model.childModels) {
		throw new Error('childModels is required');
	}
	const childModels = context.model.childModels;

	function validate() {
		if (editor) {
			editor.validate();
		}
	}

	function reloadEditor() {
		if (editor) {
			placeholder.removeChild(editor.view);
		}

		const value = context.getValue();
		const model = childModels.find(model => model.id === value.modelId);
		if (!model || !model.id) {
			throw new Error(`Model not found: ${value.modelId}`);
		}

		const childContext = context.createChildContext(model);
		editor = services.valueEditorFactoryResolver(model.id)(childContext, services);
		placeholder.appendChild(editor.view);

		validate();
	}

	function onTypeChanged() {
		const newModel = childModels[childModelSelect.getSelectedIndex()];
		const defaultValue = {
			modelId: newModel.id,
			value: newModel.getDefaultValue(services.activator)
		};
		context.setValue(defaultValue);
		reloadEditor();
	}

	const startValue = context.getValue();
	const childModelSelect = selectComponent({
		size: 'small'
	});
	childModelSelect.setValues(context.model.childModels.map(model => model.id));
	childModelSelect.selectIndex(context.model.childModels.findIndex(model => model.id === startValue.modelId));
	childModelSelect.onSelected.subscribe(onTypeChanged);

	const placeholder = Html.element('div', {
		class: 'swe-dynamic-placeholder'
	});
	const container = valueEditorContainerComponent([placeholder]);
	let editor: ValueEditor | null = null;

	reloadEditor();

	return {
		view: container.view,
		controlView: childModelSelect.view,
		validate
	};
}
