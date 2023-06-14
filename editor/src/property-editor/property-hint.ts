import { Component } from '../components/component';
import { Html } from '../core';
import { appendMultilineText } from '../core/append-multiline-text';

export interface PropertyHintComponent extends Component {
	toggle(): void;
}

export function propertyHint(text: string): PropertyHintComponent {
	let content: HTMLElement | null = null;
	const view = Html.element('div', {
		class: 'swe-property-hint'
	});

	function toggle() {
		if (content) {
			view.removeChild(content);
			content = null;
		} else {
			content = Html.element('div', {
				class: 'swe-property-hint-text'
			});
			appendMultilineText(content, text);
			view.appendChild(content);
		}
	}

	return {
		view,
		toggle
	};
}
