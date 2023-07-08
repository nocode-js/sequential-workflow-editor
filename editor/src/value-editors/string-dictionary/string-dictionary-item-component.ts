import { SimpleEvent, StringDictionaryItem } from 'sequential-workflow-editor-model';
import { validationErrorComponent } from '../../components/validation-error-component';
import { Html } from '../../core';
import { rowComponent } from '../../components/row-component';
import { inputComponent } from '../../components/input-component';
import { buttonComponent } from '../../components/button-component';
import { DynamicListItemComponent } from '../../components/dynamic-list-component';
import { Icons } from '../../core/icons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StringDictionaryItemComponent extends DynamicListItemComponent<StringDictionaryItem> {}

export function stringDictionaryItemComponent(item: StringDictionaryItem): StringDictionaryItemComponent {
	function validate(error: string | null) {
		validation.setError(error);
	}

	function onChanged() {
		onItemChanged.forward({ key: keyInput.getValue(), value: valueInput.getValue() });
	}

	const onItemChanged = new SimpleEvent<StringDictionaryItem>();
	const onDeleteClicked = new SimpleEvent<void>();

	const keyInput = inputComponent(item.key, {
		placeholder: 'Key'
	});
	keyInput.onChanged.subscribe(onChanged);

	const valueInput = inputComponent(item.value, {
		placeholder: 'Value'
	});
	valueInput.onChanged.subscribe(onChanged);

	const deleteButton = buttonComponent('Delete', {
		size: 'small',
		theme: 'secondary',
		icon: Icons.close
	});
	deleteButton.onClick.subscribe(onDeleteClicked.forward);

	const row = rowComponent([keyInput.view, valueInput.view, deleteButton.view], {
		cols: [2, 3, null]
	});

	const validation = validationErrorComponent();

	const view = Html.element('div', {
		class: 'swe-dictionary-item'
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
