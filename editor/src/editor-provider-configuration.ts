import { UidGenerator } from 'sequential-workflow-editor-model';
import { DefinitionWalker } from 'sequential-workflow-model';
import { EditorExtension } from './editor-extension';

export interface EditorProviderConfiguration {
	uidGenerator: UidGenerator;
	definitionWalker?: DefinitionWalker;
	isHeaderHidden?: boolean;
	extensions?: EditorExtension[];
}
