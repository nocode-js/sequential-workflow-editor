import { ValueContext, VariableDefinition, VariableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { variableDefinitionItemComponent } from './variable-definition-item-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { buttonComponent } from '../../components/button-component';
import { dynamicListComponent } from '../../components/dynamic-list-component';
import { Icons } from '../../core/icons';

export const variableDefinitionsValueEditorId = 'variableDefinitions';

export function variableDefinitionsValueEditor(
	context: ValueContext<VariableDefinitionsValueModel>
): ValueEditor<VariableDefinitionsValueModel> {
	function onChanged(variables: VariableDefinition[]) {
		context.setValue({
			variables
		});
	}

	function onAddClicked() {
		list.add({
			name: '',
			type: context.getValueTypes()[0]
		});
	}

	const list = dynamicListComponent<VariableDefinition>(
		context.getValue().variables,
		item => variableDefinitionItemComponent(item, context),
		context,
		{
			emptyMessage: context.i18n('variableDefinitions.noVariablesDefined', 'No variables defined')
		}
	);
	list.onChanged.subscribe(onChanged);

	const addButton = buttonComponent(context.i18n('variableDefinitions.newVariable', 'New variable'), {
		size: 'small',
		icon: Icons.add
	});
	addButton.onClick.subscribe(onAddClicked);

	const container = valueEditorContainerComponent([list.view]);

	return {
		view: container.view,
		controlView: addButton.view
	};
}
