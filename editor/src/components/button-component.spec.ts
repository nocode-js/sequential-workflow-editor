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

	it('replaces icon', () => {
		const button = buttonComponent('Icon button', { icon: 'm200' });
		const getD = () => button.view.children[0].children[0].getAttribute('d');

		expect(getD()).toBe('m200');

		button.setIcon('m100');

		expect(getD()).toBe('m100');
	});
});
