import { Html } from '../core/html';
import { dynamicListComponent } from './dynamic-list-component';

describe('DynamicListComponent', () => {
	it('replaces list', () => {
		const component = dynamicListComponent();

		expect(component.view.children.length).toBe(0);

		const a = Html.element('div');
		const b = Html.element('strong');

		component.set([{ view: a }, { view: b }]);

		expect(component.view.children.length).toBe(2);
		expect(component.view.children[0]).toBe(a);
		expect(component.view.children[1]).toBe(b);

		const c = Html.element('span');

		component.set([{ view: c }]);

		expect(component.view.children.length).toBe(1);
		expect(component.view.children[0]).toBe(c);

		component.set([]);

		expect(component.view.children.length).toBe(0);
	});
});
