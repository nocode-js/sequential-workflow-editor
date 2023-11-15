import { Html } from '../core/html';
import { rowComponent } from './row-component';

describe('RowComponent', () => {
	it('when cols not defined sets swe-col-1 class', () => {
		const a = Html.element('p');
		const b = Html.element('p');

		const row = rowComponent([a, b]);

		expect(row.view.children[0].className).toBe('swe-col swe-col-1');
		expect(row.view.children[1].className).toBe('swe-col swe-col-1');
	});

	it('when cols is defined sets appropriate classes', () => {
		const a = Html.element('p');
		const b = Html.element('p');
		const c = Html.element('p');

		const row = rowComponent([a, b, c], {
			cols: [1, 2, null]
		});

		expect(row.view.children[0].className).toBe('swe-col swe-col-1');
		expect(row.view.children[1].className).toBe('swe-col swe-col-2');
		expect(row.view.children[2].className).toBe('swe-col');
	});

	it('adds custom class', () => {
		const row = rowComponent([], {
			class: 'custom-class'
		});

		expect(row.view.className).toBe('swe-row custom-class');
	});
});
