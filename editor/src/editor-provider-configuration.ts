import { I18n, UidGenerator } from 'sequential-workflow-editor-model';
import { DefinitionWalker } from 'sequential-workflow-model';
import { EditorExtension } from './editor-extension';

export interface EditorProviderConfiguration {
	uidGenerator: UidGenerator;
	definitionWalker?: DefinitionWalker;
	i18n?: I18n;
	isHeaderHidden?: boolean;
	extensions?: EditorExtension[];
}
