import { Html } from '../core/html';
import { Component } from './component';

export interface RowComponentConfiguration {
	cols?: (number | null)[];
	class?: string;
}

export function rowComponent(elements: HTMLElement[], configuration?: RowComponentConfiguration): Component {
	let viewClass = 'swe-row';
	if (configuration && configuration.class) {
		viewClass += ' ' + configuration.class;
	}

	const view = Html.element('div', {
		class: viewClass
	});
	elements.forEach((element, index) => {
		const grow = configuration && configuration.cols ? configuration.cols[index] : 1;
		let className = 'swe-col';
		if (grow) {
			className += ` swe-col-${grow}`;
		}

		const col = Html.element('div', {
			class: className
		});
		col.appendChild(element);
		view.appendChild(col);
	});
	return {
		view
	};
}
