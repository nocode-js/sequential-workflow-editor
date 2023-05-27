import { Component } from './component';

export function valueEditorContainerComponent(elements: HTMLElement[]): Component {
	const view = document.createElement('div');
	view.className = 'swe-value-editor-container';
	elements.forEach(element => view.appendChild(element));
	return { view };
}
