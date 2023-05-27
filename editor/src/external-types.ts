import { Definition, Step } from 'sequential-workflow-model';

export interface StepEditorContext {
	notifyNameChanged(): void;
	notifyPropertiesChanged(): void;
}

export interface GlobalEditorContext {
	notifyPropertiesChanged(): void;
}

export type RootEditorProvider = (definition: Definition, context: GlobalEditorContext) => HTMLElement;
export type StepEditorProvider = (step: Step, context: StepEditorContext) => HTMLElement;

export type StepValidator = (step: Step, _: unknown, definition: Definition) => boolean;
export type RootValidator = (definition: Definition) => boolean;
