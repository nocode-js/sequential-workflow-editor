import { inputComponent } from './input-component';

describe('InputComponent', () => {
	it('triggers onChanged event when new character is added to field', () => {
		let count = 0;

		const input = inputComponent('Foo');
		input.onChanged.subscribe(value => {
			expect(value).toBe('FooB');
			count++;
		});

		(input.view as HTMLInputElement).value = 'FooB';
		input.view.dispatchEvent(new Event('input'));

		expect(count).toBe(1);
	});

	it('renders input[type=text] by default', () => {
		const input = inputComponent('x');
		expect(input.view.getAttribute('type')).toBe('text');
	});

	it('renders input[type=number] when configuration is set', () => {
		const input = inputComponent('x', { type: 'number' });
		expect(input.view.getAttribute('type')).toBe('number');
	});
});
