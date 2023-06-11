import { SimpleEvent, ValueModelContext, VariableDefinition, VariableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { Html } from '../../core/html';
import { validationErrorComponent } from '../../components/validation-error-component';
import { Component } from '../../components/component';
import { rowComponent } from '../../components/row-component';
import { buttonComponent } from '../../components/button-component';
import { selectComponent } from '../../components/select-component';
import { filterValueTypes } from '../../core/filter-value-types';

export interface VariableDefinitionItemComponent extends Component {
	onNameChanged: SimpleEvent<string>;
	onTypeChanged: SimpleEvent<number>;
	onDeleteClicked: SimpleEvent<void>;
	validate(error: string | null): void;
}

export function variableDefinitionItemComponent(
	variable: VariableDefinition,
	context: ValueModelContext<VariableDefinitionsValueModel>
): VariableDefinitionItemComponent {
	function validate(error: string | null) {
		validation.setError(error);
	}

	const onNameChanged = new SimpleEvent<string>();
	const onTypeChanged = new SimpleEvent<number>();
	const onDeleteClicked = new SimpleEvent<void>();

	const view = Html.element('div', {
		class: 'swe-variable-definition-item'
	});

	const input = Html.element('input', {
		class: 'swe-input swe-stretched',
		type: 'text',
		placeholder: 'Variable name'
	});
	input.value = variable.name;

	const valueTypes = filterValueTypes(context.getValueTypes(), context.model.configuration.valueTypes);

	const typeSelect = selectComponent({
		stretched: true
	});
	typeSelect.setValues(valueTypes);
	typeSelect.selectIndex(valueTypes.findIndex(type => type === variable.type));
	typeSelect.onSelected.subscribe(index => onTypeChanged.forward(index));

	const deleteButton = buttonComponent('Delete');
	deleteButton.onClick.subscribe(() => onDeleteClicked.forward());

	const validation = validationErrorComponent();

	input.addEventListener('input', () => onNameChanged.forward(input.value), false);

	const row = rowComponent([input, typeSelect.view, deleteButton.view], {
		cols: [2, 1, null]
	});
	view.appendChild(row.view);
	view.appendChild(validation.view);

	return {
		view,
		onNameChanged,
		onTypeChanged,
		onDeleteClicked,
		validate
	};
}
