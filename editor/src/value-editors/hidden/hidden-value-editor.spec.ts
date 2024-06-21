import { hiddenValueEditor } from './hidden-value-editor';

describe('hiddenValueEditor', () => {
	it('is hidden', () => {
		const editor = hiddenValueEditor();

		expect(editor.view).toBeDefined();
		expect(editor.isHidden).toBeDefined();
		expect((editor.isHidden as () => boolean)()).toBe(true);
	});
});
