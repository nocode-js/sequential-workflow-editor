import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Html } from '../core/html';
import { Component } from './component';

export interface SelectComponent extends Component {
	setValues(values: string[]): void;
	getSelectedIndex(): number;
	selectIndex(index: number): void;
	onSelected: SimpleEvent<number>;
}

export interface SelectConfiguration {
	size?: 'small';
	stretched?: boolean;
}

export function selectComponent(configuration?: SelectConfiguration): SelectComponent {
	function setValues(values: string[]) {
		options.forEach(option => view.removeChild(option));
		options.length = 0;

		for (let i = 0; i < values.length; i++) {
			const option = document.createElement('option');
			option.value = values[i];
			option.innerText = values[i];
			view.appendChild(option);
			options.push(option);
		}
	}

	function getSelectedIndex(): number {
		return view.selectedIndex;
	}

	function selectIndex(index: number) {
		view.selectedIndex = index;
	}

	function onSelectChanged() {
		onSelected.forward(getSelectedIndex());
	}

	const onSelected = new SimpleEvent<number>();

	let className = 'swe-select';
	if (configuration?.size) {
		className += ` swe-select-${configuration.size}`;
	}
	if (configuration?.stretched) {
		className += ' swe-stretched';
	}
	const view = Html.element('select', {
		class: className
	});
	const options: HTMLOptionElement[] = [];
	view.addEventListener('change', onSelectChanged, false);

	return {
		view,
		setValues,
		getSelectedIndex,
		selectIndex,
		onSelected
	};
}
