import { ValueEditorFactory } from './value-editors';

export interface EditorExtension {
	valueEditors?: ValueEditorExtension[];
}

export interface ValueEditorExtension {
	editorId: string;
	factory: ValueEditorFactory;
}
