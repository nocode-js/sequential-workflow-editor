import { I18n, SimpleEvent, StringDictionaryItem } from 'sequential-workflow-editor-model';
import { validationErrorComponent } from '../../components/validation-error-component';
import { Html } from '../../core';
import { rowComponent } from '../../components/row-component';
import { inputComponent } from '../../components/input-component';
import { buttonComponent } from '../../components/button-component';
import { DynamicListItemComponent } from '../../components/dynamic-list-component';
import { Icons } from '../../core/icons';

export type StringDictionaryItemComponent = DynamicListItemComponent<StringDictionaryItem>;

export function stringDictionaryItemComponent(item: StringDictionaryItem, i18n: I18n): StringDictionaryItemComponent {
	function validate(error: string | null) {
		validation.setError(error);
	}

	function onChanged() {
		onItemChanged.forward({ key: keyInput.getValue(), value: valueInput.getValue() });
	}

	const onItemChanged = new SimpleEvent<StringDictionaryItem>();
	const onDeleteClicked = new SimpleEvent<void>();

	const keyInput = inputComponent(item.key, {
		placeholder: i18n('stringDictionary.key', 'Key')
	});
	keyInput.onChanged.subscribe(onChanged);

	const valueInput = inputComponent(item.value, {
		placeholder: i18n('stringDictionary.value', 'Value')
	});
	valueInput.onChanged.subscribe(onChanged);

	const deleteButton = buttonComponent(i18n('stringDictionary.delete', 'Delete'), {
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
