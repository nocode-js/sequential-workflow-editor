import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Html } from '../core/html';
import { Component } from './component';

export interface ButtonComponent extends Component {
	onClick: SimpleEvent<void>;
}

export interface ButtonComponentConfiguration {
	size?: 'small';
}

export function buttonComponent(label: string, configuration?: ButtonComponentConfiguration): ButtonComponent {
	function onClicked(e: Event) {
		e.preventDefault();
		onClick.forward();
	}

	const onClick = new SimpleEvent<void>();

	let className = 'swe-button';
	if (configuration?.size) {
		className += ` swe-button-${configuration.size}`;
	}
	const view = Html.element('button', {
		class: className
	});
	view.innerText = label;
	view.addEventListener('click', onClicked, false);

	return {
		view,
		onClick
	};
}
