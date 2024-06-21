import { validationErrorComponent } from './validation-error-component';

describe('ValidationErrorComponent', () => {
	it('returns correct value for isHidden() and emits changes', () => {
		let emitted: boolean | null = null;
		const component = validationErrorComponent();
		component.onIsHiddenChanged.subscribe(v => (emitted = v));

		// test 1
		expect(component.isHidden()).toBe(true);
		expect(component.view.children.length).toBe(0);
		expect(emitted).toBeNull();

		// test 2
		emitted = null;
		component.setDefaultError({ $: 'Expected 2 characters' });

		expect(component.isHidden()).toBe(false);
		expect(component.view.children.length).toBeGreaterThan(0);
		expect(emitted).toBe(false);

		// test 3
		emitted = null;
		component.setDefaultError({ $: 'Expected 3 characters' });

		expect(component.isHidden()).toBe(false);
		expect(component.view.children.length).toBeGreaterThan(0);
		expect(emitted).toBeNull(); // Visibility did not change

		// test 4
		emitted = null;
		component.setDefaultError(null);

		expect(component.isHidden()).toBe(true);
		expect(component.view.children.length).toBe(0);
		expect(emitted).toBe(true);
	});
});
