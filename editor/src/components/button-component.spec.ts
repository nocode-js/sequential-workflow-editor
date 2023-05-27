import { buttonComponent } from './button-component';

describe('ButtonComponent', () => {
	it('triggers onClick event when clicked', () => {
		let clicked = false;

		const button = buttonComponent('Some button');
		button.onClick.subscribe(() => (clicked = true));

		button.view.dispatchEvent(new Event('click'));

		expect(button.view.innerText).toBe('Some button');
		expect(clicked).toBe(true);
	});
});
