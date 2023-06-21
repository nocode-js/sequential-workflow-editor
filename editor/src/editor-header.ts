import { Component } from './components/component';
import { Html } from './core';
import { appendMultilineText } from './core/append-multiline-text';

export interface EditorHeaderData {
	label: string;
	description?: string;
}

export class EditorHeader implements Component {
	public static create(data: EditorHeaderData): EditorHeader {
		const view = Html.element('div', { class: 'swe-editor-header' });

		const title = Html.element('h3', { class: 'swe-editor-header-title' });
		title.textContent = data.label;
		view.appendChild(title);

		if (data.description) {
			const description = Html.element('p', { class: 'swe-editor-header-description' });
			appendMultilineText(description, data.description);
			view.appendChild(description);
		}
		return new EditorHeader(view);
	}

	private constructor(public readonly view: HTMLElement) {}
}
