import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { Html } from '../core';

export interface InputComponent extends Component {
	onChanged: SimpleEvent<string>;
	setValue(value: string): void;
	getValue(): string;
	setReadonly(readonly: boolean): void;
}

export interface InputConfiguration {
	type?: 'text' | 'number' | 'password';
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

	function setReadonly(readonly: boolean) {
		if (readonly) {
			view.setAttribute('readonly', 'readonly');
		} else {
			view.removeAttribute('readonly');
		}
	}

	const view = Html.element('input', {
		class: 'swe-input swe-stretched',
		type: configuration?.type ?? 'text'
	});
	if (configuration?.placeholder) {
		view.setAttribute('placeholder', configuration.placeholder);
	}
	if (configuration?.isReadonly) {
		setReadonly(true);
	}
	view.value = startValue;
	view.addEventListener('input', () => {
		onChanged.forward(view.value);
	});

	return {
		view,
		onChanged,
		setValue,
		getValue,
		setReadonly
	};
}
