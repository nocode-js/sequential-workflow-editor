import { SimpleEvent, ValueContext, VariableDefinition, VariableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { Html } from '../../core/html';
import { validationErrorComponent } from '../../components/validation-error-component';
import { rowComponent } from '../../components/row-component';
import { buttonComponent } from '../../components/button-component';
import { selectComponent } from '../../components/select-component';
import { filterValueTypes } from '../../core/filter-value-types';
import { DynamicListItemComponent } from '../../components/dynamic-list-component';
import { Icons } from '../../core/icons';
import { prependedInputComponent } from '../../components/prepended-input-component';
import { inputComponent } from '../../components/input-component';

export type VariableDefinitionItemComponent = DynamicListItemComponent<VariableDefinition>;

export function variableDefinitionItemComponent(
	variable: VariableDefinition,
	context: ValueContext<VariableDefinitionsValueModel>
): VariableDefinitionItemComponent {
	function validate(error: string | null) {
		validation.setError(error);
	}

	function onTypeChanged(index: number) {
		const type = valueTypes[index];
		variable.type = type;
		onItemChanged.forward(variable);
	}

	function onNameChanged(value: string) {
		variable.name = value;
		onItemChanged.forward(variable);
	}

	const onItemChanged = new SimpleEvent<VariableDefinition>();
	const onDeleteClicked = new SimpleEvent<void>();

	const view = Html.element('div', {
		class: 'swe-variable-definition-item'
	});

	const input = prependedInputComponent(
		'$',
		inputComponent(variable.name, {
			placeholder: context.i18n('variableDefinitions.namePlaceholder', 'Variable name')
		})
	);
	input.onChanged.subscribe(onNameChanged);

	const valueTypes = filterValueTypes(context.getValueTypes(), context.model.configuration.valueTypes);

	const typeSelect = selectComponent({
		stretched: true
	});
	typeSelect.setValues(valueTypes);
	typeSelect.selectIndex(valueTypes.findIndex(type => type === variable.type));
	typeSelect.onSelected.subscribe(onTypeChanged);

	const deleteButton = buttonComponent(context.i18n('variableDefinitions.delete', 'Delete'), {
		size: 'small',
		theme: 'secondary',
		icon: Icons.close
	});
	deleteButton.onClick.subscribe(() => onDeleteClicked.forward());

	const validation = validationErrorComponent();

	const row = rowComponent([input.view, typeSelect.view, deleteButton.view], {
		cols: [2, 1, null]
	});
	view.appendChild(row.view);
	view.appendChild(validation.view);

	return {
		view,
		onItemChanged,
		onDeleteClicked,
		validate
	};
}
