import { ValueModelContext, VariableDefinition, VariableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { VariableDefinitionItemComponent, variableDefinitionItemComponent } from './variable-definition-item-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { buttonComponent } from '../../components/button-component';
import { dynamicListComponent } from '../../components/dynamic-list-component';

export const variableDefinitionsValueEditorId = 'variableDefinitions';

export function variableDefinitionsValueEditor(
	context: ValueModelContext<VariableDefinitionsValueModel>
): ValueEditor<VariableDefinitionsValueModel> {
	function updateVariables(callback: (variables: VariableDefinition[]) => void) {
		const value = Object.assign({}, context.getValue());
		callback(value.variables);
		context.setValue(value);
	}

	function updateVariable(index: number, callback: (variable: VariableDefinition) => void) {
		const value = Object.assign({}, context.getValue());
		callback(value.variables[index]);
		context.setValue(value);
	}

	function onNameChanged(newName: string, index: number) {
		updateVariable(index, variable => (variable.name = newName));
		validate();
	}

	function onTypeChanged(typeIndex: number, index: number) {
		updateVariable(index, variable => (variable.type = context.getValueTypes()[typeIndex]));
		validate();
	}

	function onAddClicked() {
		updateVariables(variables =>
			variables.push({
				name: '',
				type: context.getValueTypes()[0]
			})
		);
		reloadList();
	}

	function onDeleteClicked(index: number) {
		updateVariables(variables => variables.splice(index, 1));
		reloadList();
	}

	function reloadList() {
		const variables = context.getValue().variables;

		list.set(
			variables.map((variable, index) => {
				const item = variableDefinitionItemComponent(variable, context);
				item.onNameChanged.subscribe(newName => onNameChanged(newName, index));
				item.onTypeChanged.subscribe(newType => onTypeChanged(newType, index));
				item.onDeleteClicked.subscribe(() => onDeleteClicked(index));
				return item;
			})
		);

		validate();
	}

	function validate() {
		const result = context.validate();
		for (let i = 0; i < list.components.length; i++) {
			list.components[i].validate(result ? result[i] : null);
		}
	}

	const list = dynamicListComponent<VariableDefinitionItemComponent>({
		emptyMessage: 'No variables defined'
	});

	const addButton = buttonComponent('New', {
		size: 'small'
	});
	addButton.onClick.subscribe(onAddClicked);

	const container = valueEditorContainerComponent([list.view]);

	reloadList();

	return {
		view: container.view,
		controlView: addButton.view,
		validate
	};
}
