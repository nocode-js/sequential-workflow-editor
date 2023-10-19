import { SimpleEvent } from 'sequential-workflow-editor-model';
import { Html } from '../core/html';
import { Component } from './component';
import { Icons } from '../core/icons';

export interface ButtonComponent extends Component {
	onClick: SimpleEvent<void>;
	setIcon(d: string): void;
	setLabel(label: string): void;
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

	function setIcon(d: string) {
		if (icon) {
			icon.getElementsByTagName('path')[0].setAttribute('d', d);
		} else {
			throw new Error('This button does not have icon');
		}
	}

	function setLabel(label: string) {
		if (configuration?.icon) {
			throw new Error('Cannot change label on button with icon');
		} else {
			view.innerText = label;
		}
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
	let icon: SVGElement | undefined;
	if (configuration?.icon) {
		icon = Icons.createSvg(configuration.icon, 'swe-button-icon');
		view.appendChild(icon);
	} else {
		view.innerText = label;
	}
	view.addEventListener('click', onClicked, false);

	return {
		view,
		onClick,
		setIcon,
		setLabel
	};
}
