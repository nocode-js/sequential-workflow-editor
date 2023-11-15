import { EditorExtension, ValueEditorExtension } from '../../editor-extension';
import { ValueEditorFactory } from '../value-editor';
import { createStringValueEditor } from './string-value-editor';
import { StringValueEditorConfiguration } from './string-value-editor-configuration';

export class StringValueEditorEditorExtension implements EditorExtension {
	public static create(configuration: StringValueEditorConfiguration) {
		return new StringValueEditorEditorExtension(configuration);
	}

	private constructor(private readonly configuration: StringValueEditorConfiguration) {}

	public readonly valueEditors: ValueEditorExtension[] = [
		{
			editorId: this.configuration.editorId,
			factory: createStringValueEditor(this.configuration) as ValueEditorFactory
		}
	];
}
