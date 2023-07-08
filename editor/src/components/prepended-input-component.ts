import { Html } from '../core';
import { Component } from './component';

export function prependedInputComponent<TComponent extends Component>(prefix: string, component: TComponent): TComponent {
	const view = Html.element('div', {
		class: 'swe-prepended-input'
	});

	const pref = Html.element('span', {
		class: 'swe-prepended-input-prefix'
	});
	pref.innerText = prefix;
	view.appendChild(pref);
	view.appendChild(component.view);

	return {
		...component,
		view
	};
}
