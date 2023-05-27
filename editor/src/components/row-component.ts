import { Html } from '../core/html';
import { Component } from './component';

export interface RowComponentConfiguration {
	cols?: (number | null)[];
}

export function rowComponent(elements: HTMLElement[], configuration?: RowComponentConfiguration): Component {
	const view = Html.element('div', {
		class: 'swe-row'
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
