import { Html } from '../core/html';
import { Component } from './component';

export interface DynamicListComponent<TComponent extends Component> extends Component {
	components: TComponent[];
	set(components: TComponent[]): void;
}

export interface DynamicListComponentConfiguration {
	emptyMessage?: string;
}

export function dynamicListComponent<TComponent extends Component>(
	configuration?: DynamicListComponentConfiguration
): DynamicListComponent<TComponent> {
	function set(set: TComponent[]) {
		if (emptyRow) {
			view.removeChild(emptyRow);
			emptyRow = null;
		}
		components.forEach(component => view.removeChild(component.view));
		components.length = 0;

		if (set.length > 0) {
			set.forEach(component => {
				components.push(component);
				view.appendChild(component.view);
			});
		} else if (configuration?.emptyMessage) {
			emptyRow = Html.element('div', {
				class: 'swe-dynamic-list-empty-row'
			});
			emptyRow.innerText = configuration.emptyMessage;
			view.appendChild(emptyRow);
		}
	}

	let emptyRow: HTMLElement | null = null;
	const components: TComponent[] = [];
	const view = Html.element('div', {
		class: 'swe-dynamic-list'
	});

	return {
		components,
		view,
		set
	};
}
