const regexp = /\$[A-Za-z][a-zA-Z_0-9-]*/g;

export class TextVariableParser {
	public static parse(text: string): string[] {
		return (text.match(regexp) || []).map(v => v.substring(1));
	}

	public static replace(text: string, valueProvider: (variableName: string) => string): string {
		return text.replace(regexp, v => {
			const variableName = v.substring(1);
			return valueProvider(variableName);
		});
	}
}
