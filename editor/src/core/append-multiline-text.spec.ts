import { appendMultilineText } from './append-multiline-text';

describe('appendMultilineText()', () => {
	let parent: HTMLElement;

	beforeEach(() => {
		parent = document.createElement('div');
	});

	it('appends correctly if passed text with \\n', () => {
		appendMultilineText(parent, 'Hello\nWorld\nNow');

		expect(parent.innerHTML).toBe('Hello<br>World<br>Now');
	});

	it('appends correctly if passed text with \\r\\n', () => {
		appendMultilineText(parent, 'Hello\r\nWorld\r\nToday');

		expect(parent.innerHTML).toBe('Hello<br>World<br>Today');
	});
});
