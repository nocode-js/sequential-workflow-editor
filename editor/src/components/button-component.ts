import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Html } from '../core/html';
import { Component } from './component';
import { Icons } from '../core/icons';

export interface ButtonComponent extends Component {
	onClick: SimpleEvent<void>;
}

export interface ButtonComponentConfiguration {
	size?: 'small';
	theme?: 'secondary';
	icon?: string;
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
	if (configuration?.theme) {
		className += ` swe-button-${configuration.theme}`;
	}
	const view = Html.element('button', {
		class: className,
		title: label,
		'aria-label': label
	});
	if (configuration?.icon) {
		const svg = Icons.createSvg(configuration.icon, 'swe-button-icon');
		view.appendChild(svg);
	} else {
		view.innerText = label;
	}
	view.addEventListener('click', onClicked, false);

	return {
		view,
		onClick
	};
}
