import { UidGenerator } from 'sequential-workflow-editor-model';
import { DefinitionWalker } from 'sequential-workflow-model';

export interface EditorProviderConfiguration {
	uidGenerator: UidGenerator;
	definitionWalker?: DefinitionWalker;
	isHeaderHidden?: boolean;
}
