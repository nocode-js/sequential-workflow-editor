import { AnyVariable, AnyVariablesValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { ValueEditor } from '../value-editor';
import { anyVariableItemComponent } from './any-variable-item-component';
import { anyVariableSelectorComponent } from './any-variable-selector-component';
import { dynamicListComponent } from '../../components/dynamic-list-component';

export const anyVariablesValueEditorId = 'anyVariables';

export function anyVariablesValueEditor(context: ValueContext<AnyVariablesValueModel>): ValueEditor<AnyVariablesValueModel> {
	function onChanged(variables: AnyVariable[]) {
		context.setValue({
			variables
		});
	}

	function onNewAdded(newVariable: AnyVariable) {
		if (context.getValue().variables.some(v => v.name === newVariable.name)) {
			// TODO: variable is already added, some message?
			return;
		}
		list.add(newVariable);
	}

	const selector = anyVariableSelectorComponent(context);
	selector.onAdded.subscribe(onNewAdded);

	const list = dynamicListComponent<AnyVariable>(context.getValue().variables, anyVariableItemComponent, context, {
		emptyMessage: context.i18n('anyVariables.noVariablesSelected', 'No variables selected')
	});
	list.onChanged.subscribe(onChanged);

	const container = valueEditorContainerComponent([selector.view, list.view]);

	return {
		view: container.view
	};
}
