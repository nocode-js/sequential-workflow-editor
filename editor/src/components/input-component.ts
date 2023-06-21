import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { Html } from '../core';

export interface InputComponent extends Component {
	onChanged: SimpleEvent<string>;
	setValue(value: string): void;
	getValue(): string;
}

export interface InputConfiguration {
	type?: 'text' | 'number';
	isReadonly?: boolean;
	placeholder?: string;
}

export function inputComponent(startValue: string, configuration?: InputConfiguration): InputComponent {
	const onChanged = new SimpleEvent<string>();

	function setValue(value: string) {
		view.value = value;
	}

	function getValue(): string {
		return view.value;
	}

	const view = Html.element('input', {
		class: 'swe-input swe-stretched',
		type: configuration?.type ?? 'text'
	});
	if (configuration?.placeholder) {
		view.setAttribute('placeholder', configuration.placeholder);
	}
	if (configuration?.isReadonly) {
		view.setAttribute('readonly', 'readonly');
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
