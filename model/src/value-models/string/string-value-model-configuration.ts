export interface StringValueModelConfiguration {
	label?: string;
	minLength?: number;
	defaultValue?: string;
	pattern?: RegExp;
	multiline?: boolean | number;
	editorId?: string;
}
