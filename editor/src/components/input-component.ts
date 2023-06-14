import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Component } from './component';
import { Html } from '../core';

export interface InputComponent extends Component {
	onChanged: SimpleEvent<string>;
}

export interface InputConfiguration {
	type?: 'text' | 'number';
	placeholder?: string;
}

export function inputComponent(value: string, configuration?: InputConfiguration): InputComponent {
	const onChanged = new SimpleEvent<string>();

	const view = Html.element('input', {
		class: 'swe-input swe-stretched',
		type: configuration?.type ?? 'text'
	});
	if (configuration?.placeholder) {
		view.setAttribute('placeholder', configuration.placeholder);
	}
	view.value = value;
	view.addEventListener('input', () => {
		onChanged.forward(view.value);
	});

	return {
		view,
		onChanged
	};
}
