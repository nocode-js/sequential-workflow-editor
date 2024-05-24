import { I18n } from 'sequential-workflow-editor-model';
import { Component } from './components/component';
import { Html } from './core';
import { appendMultilineText } from './core/append-multiline-text';

export interface EditorHeaderData {
	label: string;
	description?: string;
}

export class EditorHeader implements Component {
	public static create(data: EditorHeaderData, stepType: string, i18n: I18n): EditorHeader {
		const view = Html.element('div', { class: 'swe-editor-header' });

		const title = Html.element('h3', { class: 'swe-editor-header-title' });
		title.textContent = i18n(`step.${stepType}.name`, data.label);
		view.appendChild(title);

		if (data.description) {
			const description = i18n(`step.${stepType}.description`, data.description);
			const p = Html.element('p', { class: 'swe-editor-header-description' });
			appendMultilineText(p, description);
			view.appendChild(p);
		}
		return new EditorHeader(view);
	}

	private constructor(public readonly view: HTMLElement) {}
}
