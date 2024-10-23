import { I18n, UidGenerator } from 'sequential-workflow-editor-model';
import { DefinitionWalker } from 'sequential-workflow-model';
import { EditorExtension } from './editor-extension';
import { ToolboxGroup } from './external-types';

export interface EditorProviderConfiguration {
	uidGenerator: UidGenerator;
	definitionWalker?: DefinitionWalker;
	i18n?: I18n;
	isHeaderHidden?: boolean;
	extensions?: EditorExtension[];

	/**
	 * Sorter for the toolbox groups. By default, the groups are sorted alphabetically.
	 */
	toolboxSorter?: EditorToolboxSorter;
}

export type EditorToolboxSorter = (groups: ToolboxGroup[]) => void;
