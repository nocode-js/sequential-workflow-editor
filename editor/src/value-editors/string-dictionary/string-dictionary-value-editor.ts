import { StringDictionaryItem, StringDictionaryValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { dynamicListComponent } from '../../components/dynamic-list-component';
import { stringDictionaryItemComponent } from './string-dictionary-item-component';
import { buttonComponent } from '../../components/button-component';
import { Icons } from '../../core/icons';

export const stringDictionaryValueEditorId = 'stringDictionary';

export function stringDictionaryValueEditor(context: ValueContext<StringDictionaryValueModel>): ValueEditor<StringDictionaryValueModel> {
	function onChanged(items: StringDictionaryItem[]) {
		context.setValue({
			items
		});
	}

	function onAddClicked() {
		list.add({
			key: '',
			value: ''
		});
	}

	const list = dynamicListComponent<StringDictionaryItem>(context.getValue().items, stringDictionaryItemComponent, context, {
		emptyMessage: context.i18n('stringDictionary.noItems', 'No items')
	});
	list.onChanged.subscribe(onChanged);

	const container = valueEditorContainerComponent([list.view]);

	const addButton = buttonComponent(context.i18n('stringDictionary.addItem', 'Add item'), {
		size: 'small',
		icon: Icons.add
	});
	addButton.onClick.subscribe(onAddClicked);

	return {
		view: container.view,
		controlView: addButton.view
	};
}
