import { AnyVariable, I18n, SimpleEvent } from 'sequential-workflow-editor-model';
import { Html } from '../../core/html';
import { validationErrorComponent } from '../../components/validation-error-component';
import { buttonComponent } from '../../components/button-component';
import { rowComponent } from '../../components/row-component';
import { formatVariableNameWithType } from '../../core/variable-name-formatter';
import { DynamicListItemComponent } from '../../components/dynamic-list-component';
import { Icons } from '../../core/icons';

export type AnyVariableItemComponent = DynamicListItemComponent<AnyVariable>;

export function anyVariableItemComponent(variable: AnyVariable, i18n: I18n): AnyVariableItemComponent {
	function validate(error: string | null) {
		validation.setError(error);
	}

	const onDeleteClicked = new SimpleEvent<void>();

	const view = Html.element('div');

	const name = Html.element('span');
	name.innerText = formatVariableNameWithType(variable.name, variable.type);

	const deleteButton = buttonComponent(i18n('anyVariable.delete', 'Delete'), {
		size: 'small',
		theme: 'secondary',
		icon: Icons.close
	});
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
		onItemChanged: new SimpleEvent(),
		validate
	};
}
