import { AnyVariable, SimpleEvent } from 'sequential-workflow-editor-model';
import { Html } from '../../core/html';
import { validationErrorComponent } from '../../components/validation-error-component';
import { Component } from '../../components/component';
import { buttonComponent } from '../../components/button-component';
import { rowComponent } from '../../components/row-component';
import { formatVariableName } from '../../core/variable-name-formatter';

export interface AnyVariableItemComponent extends Component {
	onDeleteClicked: SimpleEvent<void>;
	validate(error: string | null): void;
}

export function anyVariableItemComponent(variable: AnyVariable): AnyVariableItemComponent {
	function validate(error: string | null) {
		validation.setError(error);
	}

	const onDeleteClicked = new SimpleEvent<void>();

	const view = Html.element('div');

	const name = Html.element('span');
	name.innerText = `${formatVariableName(variable.name)} (${variable.type})`;

	const deleteButton = buttonComponent('Delete');
	deleteButton.onClick.subscribe(() => onDeleteClicked.forward());

	const validation = validationErrorComponent();

	const row = rowComponent([name, deleteButton.view], {
		cols: [1, null]
	});

	view.appendChild(row.view);
	view.appendChild(validation.view);

	return {
		view,
		onDeleteClicked,
		validate
	};
}
