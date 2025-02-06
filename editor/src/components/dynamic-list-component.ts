import { I18n, SimpleEvent, ValueContext } from 'sequential-workflow-editor-model';
import { Html } from '../core/html';
import { Component } from './component';
import { validationErrorComponent } from './validation-error-component';

export interface DynamicListComponent<TItem, TItemComponent extends DynamicListItemComponent<TItem> = DynamicListItemComponent<TItem>>
	extends Component {
	onChanged: SimpleEvent<TItem[]>;
	add(item: TItem): void;
	forEach(callback: (component: TItemComponent) => void): void;
}

export interface DynamicListComponentConfiguration<TItem> {
	emptyMessage?: string;
	canDelete?: (item: TItem) => string | null;
}

export interface DynamicListItemComponent<TItem> extends Component {
	onItemChanged: SimpleEvent<TItem>;
	onDeleteClicked: SimpleEvent<void>;
	validate(error: string | null): void;
}

export function dynamicListComponent<TItem, TItemComponent extends DynamicListItemComponent<TItem> = DynamicListItemComponent<TItem>>(
	initialItems: TItem[],
	itemComponentFactory: (item: TItem, i18n: I18n, index: number) => TItemComponent,
	context: ValueContext,
	configuration?: DynamicListComponentConfiguration<TItem>
): DynamicListComponent<TItem, TItemComponent> {
	const onChanged = new SimpleEvent<TItem[]>();
	const items = [...initialItems];

	function forward() {
		onChanged.forward([...items]);
	}

	function onItemChanged(newItem: TItem, index: number) {
		items[index] = newItem;
		forward();
		validateList();
	}

	function onItemDeleted(index: number) {
		if (configuration && configuration.canDelete) {
			const error = configuration.canDelete(items[index]);
			if (error) {
				window.alert(error);
				return;
			}
		}

		items.splice(index, 1);
		forward();
		reloadList();
	}

	function add(item: TItem) {
		items.push(item);
		forward();
		reloadList();
	}

	function forEach(callback: (component: TItemComponent) => void) {
		components.forEach(callback);
	}

	function reloadList() {
		if (emptyRow) {
			view.removeChild(emptyRow);
			emptyRow = null;
		}
		components.forEach(component => view.removeChild(component.view));
		components.length = 0;

		if (items.length > 0) {
			items.forEach((item, index) => {
				const component = itemComponentFactory(item, context.i18n, index);
				component.onItemChanged.subscribe(item => onItemChanged(item, index));
				component.onDeleteClicked.subscribe(() => onItemDeleted(index));
				view.insertBefore(component.view, validation.view);
				components.push(component);
			});
		} else if (configuration?.emptyMessage) {
			emptyRow = Html.element('div', {
				class: 'swe-dynamic-list-empty-row'
			});
			emptyRow.innerText = configuration.emptyMessage;
			view.insertBefore(emptyRow, validation.view);
		}
		validateList();
	}

	function validateList() {
		const result = context.validate();
		for (let i = 0; i < components.length; i++) {
			components[i].validate(result ? result[i] : null);
		}
		validation.setError(result && result.$ ? result.$ : null);
	}

	let emptyRow: HTMLElement | null = null;
	const view = Html.element('div', {
		class: 'swe-dynamic-list'
	});
	const validation = validationErrorComponent();
	view.appendChild(validation.view);

	const components: TItemComponent[] = [];

	reloadList();

	return {
		onChanged,
		view,
		add,
		forEach
	};
}
