import { I18n, UidGenerator } from 'sequential-workflow-editor-model';
import { DefinitionWalker, Step } from 'sequential-workflow-model';
import { EditorExtension } from './editor-extension';

export interface EditorProviderConfiguration {
	/**
	 * A generator of unique identifiers.
	 */
	uidGenerator: UidGenerator;

	/**
	 * The definition walker. If it's not set the editor uses the default definition walker from the `sequential-workflow-model` package.
	 */
	definitionWalker?: DefinitionWalker;

	/**
	 * The translation service for the editor.
	 */
	i18n?: I18n;

	/**
	 * Determines whether the header of the editor is hidden.
	 */
	isHeaderHidden?: boolean;

	/**
	 * Sorter for the toolbox groups. By default, the groups are sorted alphabetically.
	 */
	toolboxSorter?: EditorToolboxSorter;

	/**
	 * Extensions for the editor.
	 */
	extensions?: EditorExtension[];
}

export interface ToolboxGroup {
	/**
	 * The name of the group.
	 */
	name: string;

	/**
	 * The steps in the group.
	 */
	steps: Step[];
}

export type EditorToolboxSorter = (groups: ToolboxGroup[]) => void;
