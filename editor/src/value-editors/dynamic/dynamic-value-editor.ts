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
	if (!context.model.subModels) {
		throw new Error('subModels is required');
	}
	const subModels = context.model.subModels;

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
		const model = subModels.find(model => model.id === value.modelId);
		if (!model || !model.id) {
			throw new Error(`Model not found: ${value.modelId}`);
		}

		const childContext = context.createChildContext(model);
		editor = services.valueEditorFactoryResolver(model.id)(childContext, services);
		placeholder.appendChild(editor.view);

		validate();
	}

	function onTypeChanged() {
		const newModel = subModels[subModelSelect.getSelectedIndex()];
		const defaultValue = {
			modelId: newModel.id,
			value: newModel.getDefaultValue(services.activator)
		};
		context.setValue(defaultValue);
		reloadEditor();
	}

	const startValue = context.getValue();
	const subModelSelect = selectComponent({
		size: 'small'
	});
	subModelSelect.setValues(context.model.subModels.map(model => model.label));
	subModelSelect.selectIndex(context.model.subModels.findIndex(model => model.id === startValue.modelId));
	subModelSelect.onSelected.subscribe(onTypeChanged);

	const placeholder = Html.element('div', {
		class: 'swe-dynamic-placeholder'
	});
	const container = valueEditorContainerComponent([placeholder]);
	let editor: ValueEditor | null = null;

	reloadEditor();

	return {
		view: container.view,
		controlView: subModelSelect.view,
		validate
	};
}
