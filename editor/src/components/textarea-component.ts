import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { Html } from '../core';

export interface TextareaComponent extends Component {
	onChanged: SimpleEvent<string>;
	setValue(value: string): void;
	getValue(): string;
}

export interface TextareaConfiguration {
	placeholder?: string;
	rows: number;
}

export function textareaComponent(startValue: string, configuration: TextareaConfiguration): TextareaComponent {
	const onChanged = new SimpleEvent<string>();

	function setValue(value: string) {
		view.value = value;
	}

	function getValue(): string {
		return view.value;
	}

	const view = Html.element('textarea', {
		class: 'swe-textarea swe-stretched',
		rows: configuration?.rows?.toString() ?? '4'
	});
	if (configuration?.placeholder) {
		view.setAttribute('placeholder', configuration.placeholder);
	}
	view.value = startValue;
	view.addEventListener('input', () => {
		onChanged.forward(view.value);
	});

	return {
		view,
		onChanged,
		setValue,
		getValue
	};
}
