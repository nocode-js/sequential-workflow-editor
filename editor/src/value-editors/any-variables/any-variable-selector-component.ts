import {
	AnyVariable,
	AnyVariablesValueModel,
	ContextVariable,
	SimpleEvent,
	ValueModelContext,
	ValueType
} from 'sequential-workflow-editor-model';
import { selectComponent } from '../../components/select-component';
import { Component } from '../../components/component';
import { rowComponent } from '../../components/row-component';
import { buttonComponent } from '../../components/button-component';

export interface AnyVariableSelectorComponent extends Component {
	onAdded: SimpleEvent<AnyVariable>;
}

export function anyVariableSelectorComponent(context: ValueModelContext<AnyVariablesValueModel>): AnyVariableSelectorComponent {
	function getSelectedValueType(): ValueType {
		return valueTypes[typeSelect.getSelectedIndex()];
	}

	function getSelectedVariableName(): string | null {
		const index = variableSelect.getSelectedIndex();
		return variables && index > 0 ? variables[index - 1].name : null;
	}

	function reloadVariableSelector() {
		variables = context.getVariables(getSelectedValueType());
		const variableNames = variables.map(variable => variable.name);
		variableSelect.setValues(['-', ...variableNames]);
	}

	function onAddClicked() {
		const type = getSelectedValueType();
		const name = getSelectedVariableName();
		if (name) {
			onAdded.forward({ type, name });
			variableSelect.selectIndex(0);
		}
	}

	const onAdded = new SimpleEvent<AnyVariable>();

	const valueTypes = context.model.configuration.valueTypes ?? context.getValueTypes();
	const typeSelect = selectComponent({
		stretched: true
	});
	typeSelect.setValues(valueTypes);
	typeSelect.onSelected.subscribe(reloadVariableSelector);

	const variableSelect = selectComponent({
		stretched: true
	});
	let variables: ContextVariable[] | null = null;

	const addButton = buttonComponent('Add');
	addButton.onClick.subscribe(onAddClicked);

	const row = rowComponent([typeSelect.view, variableSelect.view, addButton.view], {
		cols: [1, 1, null]
	});

	reloadVariableSelector();

	return {
		view: row.view,
		onAdded
	};
}
