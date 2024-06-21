import { Html } from './html';

describe('Html', () => {
	it('creates element', () => {
		const element = Html.element('div', {
			'data-test': '1',
			class: 'foo'
		});

		expect(element).toBeDefined();
		expect(element.getAttribute('data-test')).toBe('1');
		expect(element.className).toBe('foo');
	});

	it('sets attribute', () => {
		const element = document.createElement('div');

		expect(element.getAttribute('data-test')).toBeNull();

		Html.attrs(element, {
			'data-test': '555'
		});

		expect(element.getAttribute('data-test')).toBe('555');
	});

	it('toggles class', () => {
		const element = document.createElement('div');

		Html.toggleClass(element, true, 'foo');

		expect(element.classList.contains('foo')).toBe(true);

		Html.toggleClass(element, false, 'foo');

		expect(element.classList.contains('foo')).toBe(false);
	});
});
