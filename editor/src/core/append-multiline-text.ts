export function appendMultilineText(target: HTMLElement, text: string) {
	const lines = text.split(/\r?\n/g);
	for (let i = 0; i < lines.length; i++) {
		if (i > 0) {
			target.appendChild(document.createElement('br'));
		}
		const line = document.createTextNode(lines[i]);
		target.appendChild(line);
	}
}
