import { AnyVariable, AnyVariablesValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { ValueEditor } from '../value-editor';
import { AnyVariableItemComponent, anyVariableItemComponent } from './any-variable-item-component';
import { anyVariableSelectorComponent } from './any-variable-selector-component';
import { dynamicListComponent } from '../../components/dynamic-list-component';

export const anyVariablesValueEditorId = 'anyVariables';

export function anyVariablesValueEditor(context: ValueContext<AnyVariablesValueModel>): ValueEditor<AnyVariablesValueModel> {
	function updateVariables(callback: (variables: AnyVariable[]) => void) {
		const value = Object.assign({}, context.getValue());
		callback(value.variables);
		context.setValue(value);
	}

	function onDeleteClicked(index: number) {
		updateVariables(variables => variables.splice(index, 1));
		reloadList();
	}

	function onNewAdded(newVariable: AnyVariable) {
		updateVariables(variables => {
			if (variables.some(v => v.name === newVariable.name)) {
				// TODO: variable is already added, some message?
				return;
			}
			variables.push(newVariable);
		});
		reloadList();
	}

	function validate() {
		const result = context.validate();
		for (let i = 0; i < list.components.length; i++) {
			list.components[i].validate(result ? result[i] : null);
		}
	}

	function reloadList() {
		const variables = context.getValue().variables;

		list.set(
			variables.map((variable, index) => {
				const item = anyVariableItemComponent(variable);
				item.onDeleteClicked.subscribe(() => onDeleteClicked(index));
				return item;
			})
		);
		validate();
	}

	const selector = anyVariableSelectorComponent(context);
	selector.onAdded.subscribe(onNewAdded);

	const list = dynamicListComponent<AnyVariableItemComponent>({
		emptyMessage: 'No variables selected'
	});

	const container = valueEditorContainerComponent([selector.view, list.view]);

	reloadList();

	return {
		view: container.view
	};
}
